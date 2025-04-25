// import { DatabaseManager } from "../dataBase.js";
// import { GestorTransacciones } from "../gestion-transicion.js";
// import { Transaccion } from "../trancision.js";

/**
 * Clase que representa a todas las criaturas que buscan herramientas
 */
export class Cliente {
  //private gestorTransacciones: GestorTransacciones;

  /**
   * Constructor de la clase Cliente
   * @param _idUnico - ID único del cliente
   * @param _nombre - Nombre del cliente
   * @param _raza - Raza del cliente
   * @param _ubicacion - Ubicación del cliente
   */
  constructor(
    private _idUnico: string,
    private _nombre: string,
    private _raza: string,
    private _ubicacion: string,
  ) {
  }

  // funcion para guardar los datos en la base de datos
  guardarDatos() {
    //DatabaseManager.guardarDatos('Cliente', this);
  }


  // Getters

  /**
   * Getter que devuelve el ID único del cliente
   * @returns - ID único del cliente
   */
  get idUnico(): string {
    return this._idUnico;
  }

  /**
   * Getter que devuelve el nombre del cliente
   * @returns - Nombre del cliente
   */
  get nombre(): string {
    return this._nombre;
  }

  /**
   * Getter que devuelve la raza del cliente
   * @returns - Raza del cliente
   */
  get raza(): string {
    return this._raza;
  }

  /**
   * Getter que devuelve la ubicación del cliente
   * @returns - Ubicación del cliente
   */
  get ubicacion(): string {
    return this._ubicacion;
  }

  // Setters

  /**
   * Setter que establece el ID único del cliente
   * @param idUnico - ID único del cliente
   */
  set idUnico(idUnico: string) {
    this._idUnico = idUnico;
  }

  /**
   * Setter que establece el nombre del cliente
   * @param nombre - Nombre del cliente
   */
  set nombre(nombre: string) {
    this._nombre = nombre;
  }

  /**
   * Setter que establece la raza del clientee 
   * @param raza - Raza del cliente
   */
  set raza(raza: string) {
    this._raza = raza;
  }

  /**
   * Setter que establece la ubicación del cliente
   * @param ubicacion - Ubicación del cliente
   */
  set ubicacion(ubicacion: string) {
    this._ubicacion = ubicacion;
  }

  

  // Métodos para interactuar con el gestor de transacciones

  // /**
  //  * Registra una venta realizada por el cliente
  //  * @param fecha - Fecha de la venta
  //  * @param bienes - Bienes intercambiados
  //  * @param cantidadCoronas - Cantidad de coronas involucrada
  //  * @param detalles - Detalles adicionales
  //  */
  // registrarVenta(fecha: Date, bienes: string[], cantidadCoronas: number, detalles: string): void {
  //   this.gestorTransacciones.registrarVenta(fecha, bienes, cantidadCoronas, detalles);
  // }

  // /**
  //  * Registra una compra realizada por el cliente
  //  * @param fecha - Fecha de la compra
  //  * @param bienes - Bienes intercambiados
  //  * @param cantidadCoronas - Cantidad de coronas involucrada
  //  * @param detalles - Detalles adicionales
  //  */
  // registrarCompra(fecha: Date, bienes: string[], cantidadCoronas: number, detalles: string): void {
  //   this.gestorTransacciones.registrarCompra(fecha, bienes, cantidadCoronas, detalles);
  // }

  // /**
  //  * Registra una devolución realizada por el cliente
  //  * @param fecha - Fecha de la devolución
  //  * @param bienes - Bienes devueltos
  //  * @param cantidadCoronas - Cantidad de coronas involucrada
  //  * @param detalles - Detalles adicionales
  //  */
  // registrarDevolucion(fecha: Date, bienes: string[], cantidadCoronas: number, detalles: string): void {
  //   this.gestorTransacciones.registrarDevolucion(fecha, bienes, cantidadCoronas, detalles);
  // }

  // /**
  //  * Obtiene el historial de transacciones del cliente
  //  * @returns - Historial de transacciones
  //  */
  // obtenerHistorialTransacciones(): Transaccion[] {
  //   return this.gestorTransacciones.obtenerHistorial();
  // }
}