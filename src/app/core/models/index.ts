// ============================================================================
// MusicUPC — Interfaces (DTOs del backend)
// ============================================================================

export type Rol = 'ADMINISTRADOR' | 'USUARIO';

// --- Auth ---
export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;
}

// --- Usuario ---
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
  rol: string;
  fechaNacimiento: string;
  fechaRegistro: string;
  fotoPerfil?: string;
}
export interface UsuarioInsert {
  nombre: string;
  apellido: string;
  email: string;
  contrasena: string;
  telefono: string;
  dni: string;
  rol: string;
  fechaNacimiento: string;
  fotoPerfil?: string;
}

// --- Artista ---
export interface Artista {
  id: number;
  nombreArtistico: string;
  bio: string;
  generos: string[];
  region: string;
  disponible: boolean;
  precioBase: number;
  aniosExperiencia: number;
}
export interface ArtistaInsert {
  nombreArtistico: string;
  bio: string;
  generosIds: number[];
  regionId: number;
  disponible: boolean;
  precioBase: number;
  fechaInicioCarrera: string;
}

// --- Genero ---
export interface Genero {
  id: number;
  nombre: string;
}
export interface GeneroInsert {
  nombre: string;
}
export interface GeneroArtistasDTO {
  genero: string;
  cantidadArtistas: number;
}

// --- Region ---
export interface Region {
  id: number;
  nombre: string;
  departamento: string;
}
export interface RegionInsert {
  nombre: string;
  departamento: string;
}
export interface RegionArtistasDTO {
  region: string;
  cantidadArtistas: number;
}

// --- Reserva ---
export interface Reserva {
  id: number;
  clienteId: number;
  fechaEvento: string;
  horaEvento: string;
  ubicacionEvento: string;
  tipoEvento: string;
  duracionHoras: number;
  precioTotal: number;
  estado: string;
  notas: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}
export interface ReservaInsert {
  clienteId: number;
  fechaEvento: string;
  horaEvento: string;
  ubicacionEvento: string;
  tipoEvento: string;
  duracionHoras: number;
  precioTotal: number;
  notas: string;
}
export interface ReservaUsuario {
  nombre: string;
  reservaId: number;
  status: string;
  notes: string;
  eventDate: string;
  eventTime: string;
  totalPrice: number;
}

// --- Pago ---
export interface Pago {
  id: number;
  reservaId: number;
  monto: number;
  metodo: string;
  estado: string;
  referenciaTransaccion: string;
  fechaPago: string;
  fechaCreacion: string;
}
export interface PagoInsert {
  reservaId: number;
  monto: number;
  metodo: string;
  estado: string;
  referenciaTransaccion: string;
}

// --- Reseña ---
export interface Reseña {
  id: number;
  usuarioId: number;
  nombreUsuario: string;
  reservaId: number;
  rating: number;
  comentario: string;
  fechaCreacion: string;
}
export interface ReseñaInsert {
  usuarioId: number;
  reservaId: number;
  rating: number;
  comentario: string;
}

// --- Notificacion ---
export interface Notificacion {
  id: number;
  usuario_id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
  leido: boolean;
  fecha_creacion: string;
}
export interface NotificacionInsert {
  usuario_id: number;
  titulo: string;
  mensaje: string;
  tipo: string;
}

// --- Suscripcion ---
export interface Suscripcion {
  id: number;
  usuario_id: number;
  tipo_plan: string;
  precio: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  fecha_creacion: string;
}
export interface SuscripcionInsert {
  usuario_id: number;
  tipo_plan: string;
  precio: number;
  fecha_fin: string;
  estado: string;
}

// --- Termino ---
export interface Termino {
  id: number;
  reservaId: number;
  terminos: string;
  status: string;
  fecha_confirmacion: string;
  fecha_creacion: string;
}
export interface TerminoInsert {
  reservaId: number;
  terminos: string;
  status: string;
  fecha_confirmacion: string;
  fecha_creacion: string;
}
