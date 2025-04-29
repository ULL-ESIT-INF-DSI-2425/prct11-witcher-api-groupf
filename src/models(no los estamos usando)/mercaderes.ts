// import { DatabaseManager } from "../dataBase.js";
// import { GestorTransacciones } from "../gestion-transicion.js";
// import { Transaccion } from "../trancision.js";

/**
 * Clase que representa a cada Mercader
 */
export class Mercader {
  //private gestorTransacciones: GestorTransacciones;

  /**
   * Constructor de la clase Mercader
   * @param _id - ID único del mercader
   * @param _nombre - Nombre del mercader
   * @param _tipo - Tipo de oficio del mercader
   * @param _ubicacion - Ubicación del mercader
   */
  constructor(
    private _id: string,
    private _nombre: string,
    private _tipo: string,
    private _ubicacion: string,
  ) {
  }

  // funcion para guardar los datos en la base de datos
  guardarDatos() {
    //DatabaseManager.guardarDatos('Mercader', this);
  }

  // Getters

  /**
   * Getter que devuelve el ID único del mercader
   * @returns - ID único del mercader
   */
  get idUnico(): string {
    return this._id;
  }

  /**
   * Getter que devuelve el nombre del mercader
   * @returns - Nombre del mercader
   */
  get nombre(): string {
    return this._nombre;
  }

  /**
   * Getter que devuelve el tipo de oficio del mercader
   * @returns - Tipo de oficio
   */
  get tipo(): string {
    return this._tipo;
  }

  /**
   * Getter que devuelve la ubicación del mercader
   * @returns - Ubicación del mercader
   */
  get ubicacion(): string {
    return this._ubicacion;
  }

  // Setters

  /**
   * Setter que modifica el ID único del mercader
   * @param id - ID único del mercader
   */
  set idUnico(id: string) {
    this._id = id;
  }

  /**
   * Setter que modifica el nombre del mercader
   * @param nombre - Nombre del mercader
   */
  set nombre(nombre: string) {
    this._nombre = nombre;
  }

  /**
   * Setter que modifica el tipo de oficio del mercader
   * @param tipo - Tipo de oficio del mercader
   */
  set tipo(tipo: string) {
    this._tipo = tipo;
  }

  /**
   * Setter que modifica la ubicación del mercader
   * @param ubicacion - Ubicación del mercader
   */
  set ubicacion(ubicacion: string) {
    this._ubicacion = ubicacion;
  }

  // Métodos para interactuar con el gestor de transacciones

  // /**
  //  * Registra una venta realizada por el mercader
  //  * @param fecha - Fecha de la venta
  //  * @param bienes - Bienes intercambiados
  //  * @param cantidadCoronas - Cantidad de coronas involucrada
  //  * @param detalles - Detalles adicionales
  //  */
  // registrarVenta(fecha: Date, bienes: string[], cantidadCoronas: number, detalles: string): void {
  //   this.gestorTransacciones.registrarVenta(fecha, bienes, cantidadCoronas, detalles);
  // }

  
  // /**
  //  * Registra una compra realizada por el mercader
  //  * @param fecha - Fecha de la compra
  //  * @param bienes - Bienes intercambiados
  //  * @param cantidadCoronas - Cantidad de coronas involucrada
  //  * @param detalles - Detalles adicionales
  //  */
  // registrarCompra(fecha: Date, bienes: string[], cantidadCoronas: number, detalles: string): void {
  //   this.gestorTransacciones.registrarCompra(fecha, bienes, cantidadCoronas, detalles);
  // }

  // /**
  //  * Registra una devolución realizada por el mercader
  //  * @param fecha - Fecha de la devolución
  //  * @param bienes - Bienes devueltos
  //  * @param cantidadCoronas - Cantidad de coronas involucrada
  //  * @param detalles - Detalles adicionales
  //  */
  // registrarDevolucion(fecha: Date, bienes: string[], cantidadCoronas: number, detalles: string): void {
  //   this.gestorTransacciones.registrarDevolucion(fecha, bienes, cantidadCoronas, detalles);
  // }

  // /**
  //  * Obtiene el historial de transacciones del mercader
  //  * @returns - Historial de transacciones
  //  */
  // obtenerHistorialTransacciones(): Transaccion[] {
  //   return this.gestorTransacciones.obtenerHistorial();
  // }
}