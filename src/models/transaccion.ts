import { Bien } from "./bienes.js";

/**
 * Clase que representa una transacción de compra, venta o devolución
 */
export class Transaccion {
    /**
     * Constructor de la clase Transaccion
     * @param _id - ID único de la transacción
     * @param _tipo - Tipo de la transacción: venta, compra o devolución
     * @param _fecha - Fecha en la que se realiza la transacción
     * @param _bienes - Lista de bienes implicados junto con sus cantidades
     * @param _total - Total en coronas de la transacción
     * @param _clienteId - ID del cliente (si aplica)
     * @param _mercaderId - ID del mercader (si aplica)
     */
    constructor(
      private _id: string,
      private _tipo: 'venta' | 'compra' | 'devolucion',
      private _fecha: Date,
      private _bienes: { bien: Bien; cantidad: number }[], 
      private _total: number,
      private _clienteId?: string,
      private _mercaderId?: string,
    ) {
    }
  
    // Métodos para guardar datos si se quiere implementar
    guardarDatos() {
      //DatabaseManager.guardarDatos('Transaccion', this);
    }
  
    // Getters
  
    /**
     * Getter que devuelve el ID de la transacción
     * @returns - ID de la transacción
     */
    get id(): string {
      return this._id;
    }
  
    /**
     * Getter que devuelve el tipo de la transacción
     * @returns - Tipo de la transacción
     */
    get tipo(): 'venta' | 'compra' | 'devolucion' {
      return this._tipo;
    }
  
    /**
     * Getter que devuelve la fecha de la transacción
     * @returns - Fecha de la transacción
     */
    get fecha(): Date {
      return this._fecha;
    }
  
    /**
     * Getter que devuelve los bienes involucrados en la transacción
     * @returns - Lista de bienes y cantidades
     */
    get bienes(): { bien: Bien; cantidad: number }[] {
      return this._bienes;
    }
  
    /**
     * Getter que devuelve el total de la transacción
     * @returns - Total en coronas
     */
    get total(): number {
      return this._total;
    }
  
    /**
     * Getter que devuelve el ID del cliente (si existe)
     * @returns - ID del cliente
     */
    get clienteId(): string | undefined {
      return this._clienteId;
    }
  
    /**
     * Getter que devuelve el ID del mercader (si existe)
     * @returns - ID del mercader
     */
    get mercaderId(): string | undefined {
      return this._mercaderId;
    }
  
    // Setters
  
    /**
     * Setter que establece el total de la transacción
     * @param total - Nuevo total
     */
    set total(total: number) {
      this._total = total;
    }
  
    /**
     * Setter que establece la lista de bienes de la transacción
     * @param bienes - Nueva lista de bienes y cantidades
     */
    set bienes(bienes: { bien: any; cantidad: number }[]) {
      this._bienes = bienes;
    }
  
    // Métodos funcionales
  
    /**
     * Calcula el total de la transacción en base al precio y cantidad de los bienes
     * @returns - Total en coronas
     */
    calcularTotal(): number {
      let total = 0;
      this._bienes.forEach(({ bien, cantidad }) => {
        total += bien.valorCoronas * cantidad;
      });
      this._total = total;
      return total;
    }
  
    /**
     * Devuelve un resumen de la transacción en forma de string
     * @returns - Resumen de la transacción
     */
    resumen(): string {
      const tipoTransaccion = this._tipo.toUpperCase();
      const fechaFormateada = this._fecha.toLocaleDateString();
      const resumenBienes = this._bienes.map(({ bien, cantidad }) => `${bien.nombre} (x${cantidad})`).join(', ');
  
      return `🔹 [${tipoTransaccion}] - ${fechaFormateada}\nBienes: ${resumenBienes}\nTotal: ${this._total} coronas`;
    }
  }
  