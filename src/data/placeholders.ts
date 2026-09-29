import type { AlbumPhoto } from './chapters'

/**
 * FOTOS TEMPORALES (Unsplash) — solo para visualizar el diseño.
 *
 * Se usan automáticamente mientras src/data/photos.ts esté vacío.
 * Cuando tengáis las fotos de la boda no hace falta tocar este archivo
 * (podéis borrarlo junto con su import en src/lib/album.ts si queréis).
 */
const u = (id: string) => `https://images.unsplash.com/${id}`

export const placeholders: AlbumPhoto[] = [
  // ── Lugares especiales ───────────────────────────────────────────────────
  {
    src: u('photo-1547911139-c06c87da7115'),
    width: 4104, height: 2736, color: '#b39a7a',
    role: 'hero', focus: '62% 55%',
    alt: 'La pareja se abraza en un campo dorado al atardecer',
  },
  {
    src: u('photo-1716813344739-51ac117d5ecc'),
    width: 4235, height: 5480, color: '#6b4a2c',
    role: 'intro',
    alt: 'Dos manos entrelazadas a contraluz, con el sol poniéndose',
  },

  // ── 01 · Antes del sí ────────────────────────────────────────────────────
  { src: u('photo-1529636273736-fc88b31ea9d9'), width: 4016, height: 6016, color: '#c9c4bd', chapter: 'antes', alt: 'El vestido colgado junto a la ventana, esperando', caption: 'Todo listo. Casi.' },
  { src: u('photo-1682226335318-f1911fdef7c1'), width: 4592, height: 3648, color: '#e9e5df', chapter: 'antes', alt: 'Últimos retoques del vestido en una habitación luminosa' },
  { src: u('photo-1445117627052-274425469152'), width: 4928, height: 3264, color: '#3c4a57', chapter: 'antes', alt: 'Colocando la flor en la solapa de la chaqueta' },
  { src: u('photo-1472417583565-62e7bdeda490'), width: 2400, height: 3600, color: '#2e2e2c', chapter: 'antes', alt: 'Detalle del reloj y los puños de la camisa' },
  { src: u('photo-1606800052052-a08af7148866'), width: 5184, height: 3456, color: '#cfc9c0', chapter: 'antes', alt: 'Las alianzas sobre una tela blanca' },
  { src: u('photo-1722805740076-7c51a8669afc'), width: 3648, height: 4560, color: '#2f2d2a', chapter: 'antes', featured: true, alt: 'Reflejo en el espejo minutos antes de salir', caption: 'Un último vistazo al espejo.' },
  { src: u('photo-1521543832500-49e69fb2bea2'), width: 3648, height: 5472, color: '#ece8e2', chapter: 'antes', alt: 'El ramo de flores blancas entre las manos' },
  { src: u('photo-1525096590600-f5d442a7f796'), width: 5472, height: 3648, color: '#8c7359', chapter: 'antes', alt: 'Ayudando a abrochar los zapatos' },
  { src: u('photo-1643216583837-f6d664d48eac'), width: 3948, height: 5922, color: '#d6d3cd', chapter: 'antes', story: false, alt: 'Mirando por la ventana antes de la ceremonia' },

  // ── 02 · La ceremonia ────────────────────────────────────────────────────
  { src: u('photo-1670529776180-60e4132ab90c'), width: 6048, height: 4024, color: '#eeebe5', chapter: 'ceremonia', alt: 'El arco floral y las sillas preparadas para la ceremonia' },
  { src: u('photo-1776267323964-06b53e774401'), width: 4000, height: 6000, color: '#ebe8e2', chapter: 'ceremonia', alt: 'Caminando hacia el altar entre los invitados' },
  { src: u('photo-1771254241231-bfacf4aa7d92'), width: 4160, height: 6240, color: '#bdb9a2', chapter: 'ceremonia', alt: 'Las manos unidas durante la ceremonia' },
  { src: u('photo-1523369579000-4ec0fe04db44'), width: 5472, height: 3648, color: '#2a2a2a', chapter: 'ceremonia', alt: 'El momento de poner el anillo, en blanco y negro' },
  { src: u('photo-1761959734157-8353b524a180'), width: 10000, height: 5755, color: '#e7e8e6', chapter: 'ceremonia', featured: true, alt: 'Vista general de la ceremonia al aire libre con todos los invitados', caption: 'Todos, por fin, en el mismo lugar.' },
  { src: u('photo-1776267884776-e5f7ba46e03d'), width: 4000, height: 6000, color: '#a8908d', chapter: 'ceremonia', alt: 'Los votos escritos a mano junto a los anillos' },
  { src: u('photo-1771254240695-5cf1d2f2f4ec'), width: 4160, height: 6240, color: '#a68c59', chapter: 'ceremonia', alt: 'La pareja frente a frente durante la ceremonia' },
  { src: u('photo-1708569177091-d93e951adb1d'), width: 3000, height: 2000, color: '#d8d6c2', chapter: 'ceremonia', alt: 'El primer beso de casados en el pasillo' },

  // ── 03 · Just married ────────────────────────────────────────────────────
  { src: u('photo-1758810413382-6a359e486365'), width: 7008, height: 4672, color: '#c2a9a8', chapter: 'just-married', featured: true, alt: 'Una lluvia de pétalos a la salida de la ceremonia', caption: 'Y de pronto, para siempre.' },
  { src: u('photo-1761328559769-e5c36bc6d010'), width: 3944, height: 7008, color: '#c4c4c2', chapter: 'just-married', alt: 'Corriendo de la mano por el pasillo, recién casados' },
  { src: u('photo-1573676048035-9c2a72b6a12a'), width: 5039, height: 3359, color: '#2b2b2b', chapter: 'just-married', alt: 'Los recién casados entre abrazos, en blanco y negro' },
  { src: u('photo-1759054710707-e1b297817ad9'), width: 3871, height: 5818, color: '#2e2d1d', chapter: 'just-married', alt: 'Un abrazo en el umbral de la puerta, con el ramo' },
  { src: u('photo-1612883833766-7930d960e16f'), width: 7952, height: 5304, color: '#d5c3c1', chapter: 'just-married', alt: 'Las manos entrelazadas, ya con los anillos puestos' },
  { src: u('photo-1779943953084-1ca8bc5273da'), width: 5464, height: 8192, color: '#2a2a28', chapter: 'just-married', alt: 'Alejándose juntos por un sendero entre árboles' },

  // ── 04 · Nosotros ────────────────────────────────────────────────────────
  { src: u('photo-1519379169146-d4b170447caa'), width: 2500, height: 1667, color: '#758a89', chapter: 'nosotros', alt: 'Retrato de la pareja en un campo verde' },
  { src: u('photo-1715285977619-6d9357168f46'), width: 4672, height: 7008, color: '#ecebe7', chapter: 'nosotros', alt: 'La pareja de pie en mitad del campo' },
  { src: u('photo-1537633468298-d86f0c2d4173'), width: 4480, height: 6720, color: '#c3d4d4', chapter: 'nosotros', alt: 'A punto de besarse bajo el velo' },
  { src: u('photo-1680884150107-8c4ea734d115'), width: 4096, height: 2736, color: '#3a3520', chapter: 'nosotros', featured: true, alt: 'Bailando solos en un campo al atardecer', caption: 'Solo nosotros, al caer la tarde.' },
  { src: u('photo-1606216836537-eea72a939072'), width: 4480, height: 6720, color: '#eeeeec', chapter: 'nosotros', alt: 'Un beso tranquilo, lejos del ruido' },
  { src: u('photo-1704243546111-7e5c2b19b0a3'), width: 3853, height: 5780, color: '#eeeeea', chapter: 'nosotros', alt: 'Un beso entre la hierba alta' },
  { src: u('photo-1604017011826-d3b4c23f8914'), width: 4896, height: 3264, color: '#e8d5d2', chapter: 'nosotros', alt: 'La pareja se besa en un campo de hierba dorada' },
  { src: u('photo-1680884150120-c944d0143401'), width: 2779, height: 4160, color: '#3a3520', chapter: 'nosotros', alt: 'Un giro de baile con el sol detrás' },

  // ── 05 · La celebración ──────────────────────────────────────────────────
  { src: u('photo-1674965381554-955d6a573354'), width: 5184, height: 3456, color: '#d8d6d2', chapter: 'celebracion', alt: 'La mesa preparada con flores blancas y naranjas' },
  { src: u('photo-1502635385003-ee1e6a1a742d'), width: 3648, height: 5472, color: '#d9d9d6', chapter: 'celebracion', alt: 'Copas de cristal alineadas sobre el mantel' },
  { src: u('photo-1680079033123-e5b22be5c523'), width: 3648, height: 5472, color: '#5c4630', chapter: 'celebracion', alt: 'Una mesa larga con velas y flores' },
  { src: u('photo-1758810410268-5e9d85b60065'), width: 6831, height: 4554, color: '#d6d7e6', chapter: 'celebracion', alt: 'El brindis de los recién casados' },
  { src: u('photo-1535254973040-607b474cb50d'), width: 4000, height: 6000, color: '#eeeeec', chapter: 'celebracion', alt: 'La tarta nupcial de varios pisos' },
  { src: u('photo-1632396690014-cf7a0a2f3bbb'), width: 4480, height: 6720, color: '#d8d8d6', chapter: 'celebracion', alt: 'Cortando la tarta juntos' },
  { src: u('photo-1624634564754-e45be6d06159'), width: 8192, height: 5464, color: '#ecdac4', chapter: 'celebracion', story: false, alt: 'Una copa de vino durante la cena' },
  { src: u('photo-1574482211311-45a2169db57c'), width: 4106, height: 2727, color: '#2a1614', chapter: 'celebracion', featured: true, alt: 'Los invitados bajo las guirnaldas de luces al anochecer', caption: 'Bajo las luces de Orba.' },

  // ── 06 · La fiesta ───────────────────────────────────────────────────────
  { src: u('photo-1648154164366-d067faecdc51'), width: 4160, height: 6240, color: '#c4c4c2', chapter: 'fiesta', alt: 'El primer baile de la noche' },
  { src: u('photo-1714972383570-44ddc9738355'), width: 6000, height: 4000, color: '#2a1512', chapter: 'fiesta', alt: 'La pista de baile llena' },
  { src: u('photo-1768777274270-5598fb227aa7'), width: 2670, height: 4000, color: '#c4c4c2', chapter: 'fiesta', alt: 'Bailando entre bengalas' },
  { src: u('photo-1482575832494-771f74bf6857'), width: 4896, height: 3264, color: '#2c2b17', chapter: 'fiesta', alt: 'Un grupo de invitados bailando' },
  { src: u('photo-1768777273847-e5d8531b7fc5'), width: 6016, height: 4016, color: '#b98d78', chapter: 'fiesta', featured: true, alt: 'La pareja baila rodeada de invitados con bengalas encendidas', caption: 'Y la noche se hizo corta.' },
  { src: u('photo-1769230375941-55a7f556d7f1'), width: 6016, height: 4016, color: '#2a1512', chapter: 'fiesta', alt: 'Un beso entre bengalas' },
  { src: u('photo-1784202387839-05ad29074027'), width: 6000, height: 3376, color: '#16292a', chapter: 'fiesta', alt: 'Bailando con los invitados bajo el cielo de la noche' },
  { src: u('photo-1764269715824-b6ed3e5e270d'), width: 6016, height: 4016, color: '#2a2a2a', chapter: 'fiesta', story: false, alt: 'Los recién casados bailando en la recepción nocturna' },

  // ── 07 · Los que estuvieron allí ─────────────────────────────────────────
  { src: u('photo-1785502682839-5cb578c42671'), width: 6000, height: 4000, color: '#2b2b2b', chapter: 'vosotros', alt: 'Cuatro amigos riendo, en blanco y negro' },
  { src: u('photo-1770301312266-9cb209eae9f6'), width: 2593, height: 3890, color: '#d9d9d6', chapter: 'vosotros', alt: 'Los invitados celebran mientras la pareja se besa' },
  { src: u('photo-1527529482837-4698179dc6ce'), width: 6000, height: 4000, color: '#2a2a2a', chapter: 'vosotros', alt: 'Copas en alto durante un brindis' },
  { src: u('photo-1775126964346-d4b6e7c5e4f0'), width: 3243, height: 4324, color: '#43302f', chapter: 'vosotros', alt: 'Los amigos levantan en hombros a uno de los recién casados' },
  { src: u('photo-1758810411287-a362740f269e'), width: 5481, height: 3654, color: '#d9d9d6', chapter: 'vosotros', alt: 'Todos celebrando alrededor de la pareja' },
  { src: u('photo-1693606101827-6eeec7df3957'), width: 4927, height: 3285, color: '#c4c4c2', chapter: 'vosotros', story: false, alt: 'La pareja riéndose junto a sus amigos' },
  { src: u('photo-1695719416493-95257680511f'), width: 4000, height: 2667, color: '#d9c4c2', chapter: 'vosotros', featured: true, alt: 'Foto de grupo con todos los invitados', caption: 'Los que estuvieron allí.' },

  // ── Foto final ───────────────────────────────────────────────────────────
  {
    src: u('photo-1640273296013-e4b54eaf52eb'),
    width: 6720, height: 4480, color: '#a67340',
    role: 'closing',
    alt: 'Siluetas de la pareja caminando por una colina al atardecer',
  },
]
