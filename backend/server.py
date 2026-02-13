from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class Article(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    slug: str
    excerpt: str
    content: str
    category: str
    image_url: str
    reading_time: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    featured: bool = False

class ArticleCreate(BaseModel):
    title: str
    slug: str
    excerpt: str
    content: str
    category: str
    image_url: str
    reading_time: int
    featured: bool = False

class Category(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str
    description: str
    image_url: str
    article_count: int = 0

class NewsletterSubscription(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    subscribed_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    active: bool = True

class NewsletterSubscribe(BaseModel):
    email: str

# Artículos de muestra sobre turismo en París - En español mexicano
SAMPLE_ARTICLES = [
    {
        "title": "La Torre Eiffel: Símbolo Eterno de París",
        "slug": "torre-eiffel-simbolo-paris",
        "excerpt": "Descubre la fascinante historia de la Dama de Hierro, desde su controvertida construcción hasta su estatus de ícono mundial.",
        "content": """<p>La Torre Eiffel, construida por Gustave Eiffel para la Exposición Universal de 1889, es sin duda el monumento más emblemático de París. Con sus 330 metros de altura, fue durante 41 años la estructura más alta del mundo.</p>
        
<h2>Una Construcción Revolucionaria</h2>
<p>La construcción de la torre requirió 2 años, 2 meses y 5 días de trabajo. Más de 18,000 piezas de hierro pudelado y 2.5 millones de remaches fueron ensamblados por 300 obreros acróbatas. En esa época, muchos artistas e intelectuales, incluyendo a Guy de Maupassant, se oponían a su construcción, calificándola de "esqueleto desagradable".</p>

<h2>Visitar la Torre Eiffel</h2>
<p>Hoy en día, la Torre Eiffel recibe cerca de 7 millones de visitantes al año. Puedes subir hasta la cima en elevador o a pie hasta los dos primeros pisos. El restaurante Le Jules Verne, ubicado en el segundo piso, ofrece una experiencia gastronómica única con una vista impresionante de París.</p>

<h2>Consejos Prácticos</h2>
<p>Para evitar las largas filas, reserva tus boletos en línea con anticipación. El mejor momento para visitar es al atardecer, cuando la luz dorada baña la ciudad. No olvides admirar el centelleo de la torre que ilumina París cada noche durante 5 minutos, cada hora hasta la 1 de la madrugada.</p>""",
        "category": "monumentos",
        "image_url": "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&q=80",
        "reading_time": 5,
        "featured": True
    },
    {
        "title": "El Museo del Louvre: Un Viaje a Través de los Siglos",
        "slug": "museo-louvre-viaje-siglos",
        "excerpt": "Explora el museo de arte más grande del mundo, desde la Mona Lisa hasta las antigüedades egipcias.",
        "content": """<p>El Louvre, antiguo palacio real, es hoy el museo más visitado del mundo con cerca de 10 millones de visitantes anuales. Sus colecciones cuentan con más de 380,000 objetos y 35,000 obras expuestas.</p>

<h2>Los Imperdibles</h2>
<p>La Mona Lisa de Leonardo da Vinci sigue siendo la atracción principal, pero no te pierdas la Venus de Milo, la Victoria de Samotracia y los apartamentos de Napoleón III. El departamento de Antigüedades Egipcias es uno de los más ricos del mundo.</p>

<h2>La Pirámide del Louvre</h2>
<p>Diseñada por el arquitecto Ieoh Ming Pei e inaugurada en 1989, la pirámide de cristal se ha convertido en un símbolo de la modernidad parisina. Sirve como entrada principal al museo y alberga un amplio vestíbulo de recepción.</p>

<h2>Consejos de Visita</h2>
<p>El Louvre es inmenso - planea al menos medio día. Descarga la aplicación del museo para orientarte. Las noches de miércoles y viernes son ideales para una visita más tranquila. La entrada es gratuita el primer domingo de cada mes.</p>""",
        "category": "museos",
        "image_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80",
        "reading_time": 6,
        "featured": True
    },
    {
        "title": "Montmartre: El Pueblo Bohemio de París",
        "slug": "montmartre-pueblo-bohemio",
        "excerpt": "Pasea por las callejuelas empedradas del barrio de los artistas, entre cabarets históricos y vistas panorámicas.",
        "content": """<p>Ubicado en la colina más alta de París, Montmartre ha conservado su encanto de pueblo con sus callejuelas empedradas, sus escaleras secretas y sus viñedos. Este barrio mítico vio pasar a Picasso, Van Gogh, Toulouse-Lautrec y muchos otros artistas.</p>

<h2>La Basílica del Sagrado Corazón</h2>
<p>Dominando París desde sus 130 metros de altura, la basílica ofrece una de las vistas más hermosas de la capital. Construida entre 1875 y 1914, es accesible a pie por las famosas escaleras o en funicular.</p>

<h2>La Plaza del Tertre</h2>
<p>Corazón artístico de Montmartre, esta pintoresca plaza reúne pintores y retratistas. A pesar de su lado turístico, conserva la atmósfera bohemia que hizo la reputación del barrio.</p>

<h2>El Moulin Rouge</h2>
<p>Fundado en 1889, este legendario cabaret al pie de la colina continúa presentando espectáculos de ensueño. Su molino rojo iluminado se ha convertido en uno de los símbolos de la vida nocturna parisina.</p>

<h2>Paseo Recomendado</h2>
<p>Comienza en la plaza des Abbesses (la estación de metro más bonita de París), sube por la calle Lepic, descubre el Moulin de la Galette, luego dirígete a la plaza del Tertre antes de terminar en el Sagrado Corazón.</p>""",
        "category": "barrios",
        "image_url": "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&q=80",
        "reading_time": 5,
        "featured": True
    },
    {
        "title": "El Arco del Triunfo: Gloria e Historia de Francia",
        "slug": "arco-triunfo-gloria-historia",
        "excerpt": "Sube a la cima de este monumento napoleónico para una vista de 360° sobre los Campos Elíseos.",
        "content": """<p>Ordenado por Napoleón I en 1806 para celebrar sus victorias militares, el Arco del Triunfo se alza majestuosamente en el centro de la plaza Charles-de-Gaulle, desde donde irradian doce avenidas.</p>

<h2>Arquitectura y Simbolismo</h2>
<p>Con 50 metros de alto y 45 metros de ancho, el Arco está adornado con esculturas monumentales, incluyendo la famosa "Marsellesa" de François Rude. Los nombres de 558 generales y las grandes batallas del Imperio están grabados en sus pilares.</p>

<h2>La Llama del Soldado Desconocido</h2>
<p>Bajo el Arco reposa desde 1920 el cuerpo de un soldado no identificado de la Primera Guerra Mundial. Cada tarde a las 18:30, la llama del recuerdo es reavivada en una emotiva ceremonia.</p>

<h2>La Terraza Panorámica</h2>
<p>Después de subir los 284 escalones, descubrirás una vista espectacular de París: los Campos Elíseos hasta la Concordia, La Défense, la Torre Eiffel y Montmartre. Un paso subterráneo permite acceder al monumento de manera segura.</p>""",
        "category": "monumentos",
        "image_url": "https://images.unsplash.com/photo-1524396309943-e03f5249f002?w=800&q=80",
        "reading_time": 4,
        "featured": False
    },
    {
        "title": "El Museo de Orsay: Templo del Impresionismo",
        "slug": "museo-orsay-impresionismo",
        "excerpt": "Admira las obras maestras de Monet, Renoir y Van Gogh en una antigua estación de tren convertida en museo.",
        "content": """<p>Instalado en la antigua estación de Orsay, este museo alberga la colección más grande de obras impresionistas y postimpresionistas del mundo. La arquitectura en sí es una obra de arte, con su gran reloj y su monumental vidriera.</p>

<h2>Las Colecciones</h2>
<p>El museo presenta arte occidental de 1848 a 1914: pintura, escultura, artes decorativas y fotografía. Las obras de Monet, Degas, Renoir, Cézanne, Van Gogh y Gauguin constituyen el corazón de las colecciones.</p>

<h2>Obras Imperdibles</h2>
<p>No te pierdas "El almuerzo sobre la hierba" de Manet, los "Nenúfares" de Monet, "Baile en el Moulin de la Galette" de Renoir, y "La noche estrellada" de Van Gogh. "La pequeña bailarina de catorce años" de Degas es también una maravilla.</p>

<h2>Consejos Prácticos</h2>
<p>El café Campana, con su decoración Art Nouveau, ofrece un agradable descanso. La terraza detrás de los relojes da al Sena y al Louvre. Visita al final de la tarde para disfrutar de la luz dorada filtrándose por la vidriera.</p>""",
        "category": "museos",
        "image_url": "https://images.unsplash.com/photo-1587018681440-5a13e8d0a2c2?w=800&q=80",
        "reading_time": 5,
        "featured": False
    },
    {
        "title": "El Marais: Historia y Tendencias en el Corazón de París",
        "slug": "marais-historia-tendencias",
        "excerpt": "Descubre el barrio más de moda de París, entre mansiones particulares y tiendas de diseño.",
        "content": """<p>El Marais es uno de los barrios más antiguos y mejor conservados de París. Sus callejuelas medievales albergan mansiones del siglo XVII, museos íntimos, galerías de arte y una escena gastronómica efervescente.</p>

<h2>La Plaza de los Vosgos</h2>
<p>La plaza más antigua de París (1612), la plaza de los Vosgos es una joya arquitectónica con sus pabellones de ladrillo rosa y sus arcadas. Victor Hugo vivió ahí de 1832 a 1848, su casa es hoy un museo gratuito.</p>

<h2>El Barrio Judío</h2>
<p>La calle des Rosiers es el corazón histórico de la comunidad judía parisina. Aquí encuentras los mejores falafels de París, especialmente en L'As du Fallafel, una institución desde 1979.</p>

<h2>Compras y Cultura</h2>
<p>El Marais está lleno de tiendas de diseñadores, concept stores y tiendas vintage. No te pierdas el museo Picasso, el museo Carnavalet (historia de París) y el Centro Pompidou muy cerca.</p>

<h2>El Domingo en el Marais</h2>
<p>Es el único barrio de París donde los comercios están abiertos el domingo. El ambiente es particularmente animado con sus terrazas llenas y sus paseantes.</p>""",
        "category": "barrios",
        "image_url": "https://images.unsplash.com/photo-1549887534-1541e9326642?w=800&q=80",
        "reading_time": 5,
        "featured": False
    },
    {
        "title": "Notre-Dame de París: Renacimiento de una Catedral",
        "slug": "notre-dame-renacimiento-catedral",
        "excerpt": "La historia de la catedral gótica más famosa del mundo, desde su construcción hasta su reconstrucción.",
        "content": """<p>Construida entre 1163 y 1345, Notre-Dame de París es una obra maestra de la arquitectura gótica. Después del devastador incendio de abril de 2019, se emprendió una reconstrucción excepcional para devolverle su esplendor.</p>

<h2>Una Joya Gótica</h2>
<p>La catedral impresiona por sus dimensiones: 130 metros de largo, torres de 69 metros, y una aguja que alcanzaba los 96 metros. Sus rosetones, entre los más grandes de Europa, son maravillas del arte del vitral medieval.</p>

<h2>Victor Hugo y la Salvaguarda</h2>
<p>En el siglo XIX, la catedral estaba en ruinas. La novela "Nuestra Señora de París" de Victor Hugo (1831) sensibilizó al público y llevó a una gran restauración dirigida por Viollet-le-Duc.</p>

<h2>La Reconstrucción</h2>
<p>Después del incendio de 2019, artesanos de todo el mundo participaron en la reconstrucción. La aguja fue reconstruida de manera idéntica, y la catedral reabrió sus puertas en diciembre de 2024, magníficamente restaurada.</p>

<h2>Visitar Notre-Dame</h2>
<p>La entrada a la catedral es gratuita. Para subir a las torres y admirar París con las gárgolas, reserva en línea. El atrio ofrece una perspectiva ideal para fotografiar la fachada occidental.</p>""",
        "category": "monumentos",
        "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
        "reading_time": 6,
        "featured": True
    },
    {
        "title": "Crucero por el Sena: París Visto desde el Agua",
        "slug": "crucero-sena-paris-agua",
        "excerpt": "Embárcate en un paseo romántico y descubre los monumentos parisinos más hermosos desde el Sena.",
        "content": """<p>El Sena atraviesa París a lo largo de 13 kilómetros, bordeado por 37 puentes y los monumentos más bellos de la capital. Un crucero permite descubrir la ciudad desde un ángulo único y romántico.</p>

<h2>Los Bateaux-Mouches</h2>
<p>Creados en 1949, los Bateaux-Mouches se han convertido en una institución parisina. Ofrecen cruceros comentados de una hora, con salida al pie de la Torre Eiffel o cerca de Notre-Dame.</p>

<h2>El Recorrido Clásico</h2>
<p>Un crucero típico pasa frente al museo de Orsay, el Louvre, Notre-Dame, el Ayuntamiento, y la Torre Eiffel. Los comentarios en varios idiomas cuentan la historia de cada monumento.</p>

<h2>Cena-Crucero</h2>
<p>Para una experiencia inolvidable, opta por una cena-crucero. Gastronomía francesa, champán y monumentos iluminados crean un ambiente mágico, ideal para una ocasión especial.</p>

<h2>Consejos</h2>
<p>El crucero al atardecer es el más espectacular. En invierno, los barcos tienen calefacción. Para más intimidad, prueba las vedettes de París, más pequeñas que los Bateaux-Mouches.</p>""",
        "category": "paseos",
        "image_url": "https://images.unsplash.com/photo-1471623432079-b009d30b6729?w=800&q=80",
        "reading_time": 4,
        "featured": False
    },
    {
        "title": "El Centro Pompidou: Arte Contemporáneo en París",
        "slug": "centro-pompidou-arte-contemporaneo",
        "excerpt": "Sumérgete en el universo del arte moderno y contemporáneo en una arquitectura revolucionaria.",
        "content": """<p>Inaugurado en 1977, el Centro Pompidou revolucionó la arquitectura museística con su estructura "al revés": tuberías, escaleras mecánicas y conductos técnicos están expuestos al exterior, dejando el interior totalmente libre.</p>

<h2>Las Colecciones</h2>
<p>El Museo Nacional de Arte Moderno posee la colección más grande de arte moderno y contemporáneo de Europa. De Matisse a Jeff Koons, pasando por Kandinsky, Picasso y Warhol, se conservan más de 100,000 obras.</p>

<h2>La Arquitectura</h2>
<p>Diseñado por Renzo Piano y Richard Rogers, el edificio es un manifiesto arquitectónico. Los tubos de colores corresponden a funciones: azul para el aire, verde para el agua, amarillo para la electricidad, rojo para la circulación.</p>

<h2>La Piazza</h2>
<p>La explanada frente al Centro es un lugar de vida animado: malabaristas, músicos y artistas callejeros se presentan ahí. La fuente Stravinsky, con sus esculturas móviles de Niki de Saint Phalle y Jean Tinguely, es un espectáculo en sí misma.</p>

<h2>Vista Panorámica</h2>
<p>El restaurante Georges, en el 6º piso, ofrece una vista impresionante de París. El acceso a la terraza es gratuito con el boleto del museo.</p>""",
        "category": "museos",
        "image_url": "https://images.unsplash.com/photo-1737903150927-992d8a53ac58?w=800&q=80",
        "reading_time": 5,
        "featured": False
    },
    {
        "title": "Saint-Germain-des-Prés: El Espíritu de la Orilla Izquierda",
        "slug": "saint-germain-des-pres-orilla-izquierda",
        "excerpt": "Camina sobre los pasos de Sartre y Beauvoir en el barrio literario e intelectual de París.",
        "content": """<p>Saint-Germain-des-Prés encarna la elegancia intelectual parisina. Este barrio de la orilla izquierda fue la cuna del existencialismo, del jazz y de la edición francesa. Hoy, mezcla tiendas de lujo y cafés históricos.</p>

<h2>Los Cafés Míticos</h2>
<p>Les Deux Magots y el Café de Flore son instituciones. Sartre, Beauvoir, Camus y Hemingway tenían sus mesas reservadas. A pesar de los precios elevados, la experiencia vale la pena para impregnarse de la atmósfera.</p>

<h2>La Iglesia de Saint-Germain-des-Prés</h2>
<p>La iglesia más antigua de París (siglo VI), es el vestigio de una poderosa abadía benedictina. Su campanario románico y sus capiteles merovingios son testimonio de 1,500 años de historia.</p>

<h2>Compras y Cultura</h2>
<p>Las calles del barrio están llenas de galerías de arte, librerías antiguas y casas editoriales. Las calles de Seine y Bonaparte son particularmente ricas en galerías.</p>

<h2>El Jardín de Luxemburgo</h2>
<p>A pocos pasos, este jardín a la francesa es uno de los más bellos de París. Sus sillas metálicas verdes, su estanque donde navegan veleros miniatura y su palacio seducen a parisinos y visitantes.</p>""",
        "category": "barrios",
        "image_url": "https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80",
        "reading_time": 5,
        "featured": False
    },
    {
        "title": "Versalles: El Esplendor del Rey Sol",
        "slug": "versalles-esplendor-rey-sol",
        "excerpt": "Visita el palacio más fastuoso de Europa y sus legendarios jardines a la francesa.",
        "content": """<p>A solo 20 km de París, el Palacio de Versalles es uno de los más grandes del mundo. Construido por Luis XIV, simboliza el poder absoluto y el arte de vivir a la francesa.</p>

<h2>Los Grandes Apartamentos</h2>
<p>La Galería de los Espejos, con sus 357 espejos y sus candelabros de cristal, es la joya del palacio. Los apartamentos del Rey y de la Reina dan testimonio del fasto de la corte. El salón del Ojo de Buey y la recámara del Rey son particularmente impresionantes.</p>

<h2>Los Jardines</h2>
<p>Diseñados por Le Nôtre, los jardines se extienden sobre 800 hectáreas. Fuentes, bosquecillos, parterres de flores y el Gran Canal componen una obra maestra del arte paisajístico. Las Grandes Aguas, espectáculo de fuentes con música, tienen lugar de abril a octubre.</p>

<h2>El Dominio de María Antonieta</h2>
<p>El Pequeño Trianón y la Aldea de la Reina ofrecen un contraste sorprendente con el palacio. María Antonieta jugaba a ser pastora en un escenario campestre recreado.</p>

<h2>Consejos de Visita</h2>
<p>Planea un día completo. Llega temprano para evitar las multitudes. El Pasaporte Versalles da acceso a todo el dominio. El tren RER C desde París te lleva en 40 minutos.</p>""",
        "category": "paseos",
        "image_url": "https://images.unsplash.com/photo-1615107312926-95bd45b53d38?w=800&q=80",
        "reading_time": 7,
        "featured": True
    },
    {
        "title": "Las Catacumbas: El París Subterráneo",
        "slug": "catacumbas-paris-subterraneo",
        "excerpt": "Desciende al osario más famoso del mundo y explora el París misterioso bajo tus pies.",
        "content": """<p>Bajo las animadas calles de París se esconde un mundo subterráneo fascinante. Las Catacumbas albergan los restos de 6 millones de parisinos, trasladados de los cementerios de la ciudad a partir de 1786.</p>

<h2>Historia de las Catacumbas</h2>
<p>Ante la sobrepoblación de los cementerios parisinos, especialmente el de los Inocentes, las autoridades decidieron trasladar los restos a las antiguas canteras de piedra caliza. El traslado, realizado de noche, duró cerca de 80 años.</p>

<h2>El Recorrido de Visita</h2>
<p>Después de bajar 130 escalones, recorres 1.5 km de galerías. Los huesos están apilados de manera artística, formando patrones e inscripciones. La atmósfera es a la vez macabra y extrañamente pacífica.</p>

<h2>Información Práctica</h2>
<p>La entrada está en la plaza Denfert-Rochereau. La temperatura es constante a 14°C - lleva una chamarra. El número de visitantes está limitado, reserva en línea para evitar las filas que pueden superar las 2 horas.</p>

<h2>Más Allá de las Catacumbas</h2>
<p>Las galerías visitables representan solo una ínfima parte de la red subterránea parisina que se extiende sobre 300 km. Los "catáfilos" exploran ilegalmente este laberinto durante expediciones nocturnas.</p>""",
        "category": "paseos",
        "image_url": "https://images.unsplash.com/photo-1706820864836-4a233c74531f?w=800&q=80",
        "reading_time": 5,
        "featured": False
    },
    {
        "title": "El Palacio Garnier: Esplendor de la Ópera de París",
        "slug": "palacio-garnier-opera-paris",
        "excerpt": "Descubre el teatro más bello del mundo, su gran escalera y el misterio del fantasma de la ópera.",
        "content": """<p>Obra maestra de la arquitectura del Segundo Imperio, el Palacio Garnier es un monumento dedicado al arte lírico. Construido por Charles Garnier entre 1861 y 1875, deslumbra por su magnificencia.</p>

<h2>Arquitectura y Decoración</h2>
<p>La fachada ricamente ornamentada anuncia el esplendor interior. La Gran Escalera de mármol policromado, el Gran Vestíbulo con sus oros y mosaicos, y la sala de espectáculos con su techo pintado por Chagall son maravillas.</p>

<h2>La Leyenda del Fantasma</h2>
<p>La novela de Gaston Leroux "El Fantasma de la Ópera" se inspira en este lugar. El lago subterráneo, los palcos secretos y los pasillos laberínticos alimentan la leyenda. Algunos afirman que el fantasma todavía ronda el lugar...</p>

<h2>Visita y Espectáculos</h2>
<p>Las visitas guiadas permiten descubrir los bastidores, la biblioteca-museo y los espacios de ensayo. Asistir a un ballet o una ópera en este escenario es una experiencia inolvidable.</p>

<h2>El Restaurante</h2>
<p>El Restaurante de la Ópera, instalado bajo el techo pintado por Chagall, ofrece cocina francesa refinada en un decorado excepcional. Accesible incluso sin boleto de espectáculo.</p>""",
        "category": "monumentos",
        "image_url": "https://images.unsplash.com/photo-1665692133479-1889c99e8995?w=800&q=80",
        "reading_time": 5,
        "featured": False
    }
]

CATEGORIES = [
    {
        "name": "Monumentos",
        "slug": "monumentos",
        "description": "Descubre los monumentos emblemáticos de París, de la Torre Eiffel al Arco del Triunfo.",
        "image_url": "https://images.unsplash.com/photo-1543349689-9a4d426bee8e?w=800&q=80"
    },
    {
        "name": "Museos",
        "slug": "museos",
        "description": "Explora los museos más grandes del mundo, del Louvre al Centro Pompidou.",
        "image_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=800&q=80"
    },
    {
        "name": "Barrios",
        "slug": "barrios",
        "description": "Pasea por los barrios auténticos de París, de Montmartre al Marais.",
        "image_url": "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&q=80"
    },
    {
        "name": "Paseos",
        "slug": "paseos",
        "description": "Descubre las mejores experiencias y paseos guiados en París.",
        "image_url": "https://images.unsplash.com/photo-1471623432079-b009d30b6729?w=800&q=80"
    }
]

# Seed database on startup
@app.on_event("startup")
async def seed_database():
    # Check if articles already exist
    existing_articles = await db.articles.count_documents({})
    if existing_articles == 0:
        # Insert sample articles
        for article_data in SAMPLE_ARTICLES:
            article = Article(**article_data)
            doc = article.model_dump()
            doc['created_at'] = doc['created_at'].isoformat()
            await db.articles.insert_one(doc)
        logging.info(f"Seeded {len(SAMPLE_ARTICLES)} articles")
    
    # Check if categories already exist
    existing_categories = await db.categories.count_documents({})
    if existing_categories == 0:
        for cat_data in CATEGORIES:
            # Count articles in this category
            count = await db.articles.count_documents({"category": cat_data["slug"]})
            category = Category(**cat_data, article_count=count)
            doc = category.model_dump()
            await db.categories.insert_one(doc)
        logging.info(f"Seeded {len(CATEGORIES)} categories")

# API Routes
@api_router.get("/")
async def root():
    return {"message": "París Bohème API"}

@api_router.get("/articles", response_model=List[Article])
async def get_articles(category: Optional[str] = None, featured: Optional[bool] = None):
    query = {}
    if category and category != "all":
        query["category"] = category
    if featured is not None:
        query["featured"] = featured
    
    articles = await db.articles.find(query, {"_id": 0}).sort("created_at", -1).to_list(100)
    
    for article in articles:
        if isinstance(article.get('created_at'), str):
            article['created_at'] = datetime.fromisoformat(article['created_at'])
    
    return articles

@api_router.get("/articles/{slug}", response_model=Article)
async def get_article(slug: str):
    article = await db.articles.find_one({"slug": slug}, {"_id": 0})
    if not article:
        raise HTTPException(status_code=404, detail="Artículo no encontrado")
    
    if isinstance(article.get('created_at'), str):
        article['created_at'] = datetime.fromisoformat(article['created_at'])
    
    return article

@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    
    # Update article counts
    for cat in categories:
        count = await db.articles.count_documents({"category": cat["slug"]})
        cat["article_count"] = count
    
    return categories

@api_router.get("/featured-articles", response_model=List[Article])
async def get_featured_articles():
    articles = await db.articles.find({"featured": True}, {"_id": 0}).sort("created_at", -1).to_list(6)
    
    for article in articles:
        if isinstance(article.get('created_at'), str):
            article['created_at'] = datetime.fromisoformat(article['created_at'])
    
    return articles

@api_router.post("/newsletter/subscribe", response_model=NewsletterSubscription)
async def subscribe_newsletter(data: NewsletterSubscribe):
    # Check if email already exists
    existing = await db.newsletter.find_one({"email": data.email.lower()})
    if existing:
        if existing.get("active"):
            raise HTTPException(status_code=400, detail="Este email ya está suscrito")
        else:
            # Reactivate subscription
            await db.newsletter.update_one(
                {"email": data.email.lower()},
                {"$set": {"active": True, "subscribed_at": datetime.now(timezone.utc).isoformat()}}
            )
            return NewsletterSubscription(
                id=existing["id"],
                email=data.email.lower(),
                active=True
            )
    
    # Create new subscription
    subscription = NewsletterSubscription(email=data.email.lower())
    doc = subscription.model_dump()
    doc['subscribed_at'] = doc['subscribed_at'].isoformat()
    await db.newsletter.insert_one(doc)
    return subscription

@api_router.get("/newsletter/subscribers")
async def get_subscribers():
    subscribers = await db.newsletter.find({"active": True}, {"_id": 0}).to_list(1000)
    return {"count": len(subscribers), "subscribers": subscribers}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
