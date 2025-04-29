//import { DatabaseManager } from "../dataBase.js";
/**
 * Clase que representa los bien
 */
export class Bien {
  /**
   * Constructor de la clase Bien
   * @param _idUnico - idUnico del bien
   * @param _nombre - nombre del bien
   * @param _descripcion - descripcion del bien
   * @param _material - material del bien
   * @param _peso - peso del bien
   * @param _valorCoronas - valorCoronas del bien
   */
  constructor(
      private _idUnico: string,
      private _nombre: string,
      private _descripcion: string,
      private _material: string,
      private _peso: number,
      private _valorCoronas: number
  ) {
  }

  // funcion para guardar los datos en la base de datos
  guardarDatos() {
    //DatabaseManager.guardarDatos('Bien', this);
  }

  // Getters
  /**
   * Getter que devuelve el idUnico de bienes
   * @returns - idUnico de bienes 
   */
  get idUnico(): string {
    return this._idUnico;
  }

  /**
   * Getter que devuelve el nombre del bien
   * @returns - Nombre del bien
   */
  get nombre(): string {
    return this._nombre;
  }

  /**
   * Getter que devuelve la descripcion del bien
   * @returns - descripcion del bien
   */
  get descripcion(): string {
    return this._descripcion;
  }
  
  /**
   * Getter que devuelve el material del bien
   * @returns - material del bien
   */
  get material(): string {
    return this._material;
  }

  /**
   * Getter que devuelve el peso del bien
   * @returns - peso del bien
   */
  get peso(): number {
    return this._peso;
  }

  /**
   * Getter que devuelve el valorCoronas del bien
   * @returns - valorCoronas del bi
n     */
  get valorCoronas(): number {
    return this._valorCoronas;
  }


  /**
   * Setter que establece el idUnico del bien
   * @param idUnico - idUnico del bien
   */
  set idUnico(idUnico: string) {
    this._idUnico = idUnico;
  }

  /**
   * Setter que establece el nombre del bien
   * @param nombre - nombre del bien
   */
  set nombre(nombre: string) {
    this._nombre = nombre;
  }
  
  /**
   * Setter que establece la descripcion del bien
   * @param descripcion - descripcion del bien
   */
  set descripcion(descripcion: string) {
    this._descripcion = descripcion;
  }
  
  /**
   * Setter que establece el material del bien
   * @param material - material del bien
   */
  set material(material: string) {
    this._material = material;
  }

  /**
   * Setter que estable el peso del bien
   * @param peso - peso del bien
   */
  set peso(peso: number) {
    this._peso = peso;
  }

  /**
   * Setter que establece el valorCoronas del bien
   * @param valorCoronas - valorCoronas del bien
   */
  set valorCoronas(valorCoronas: number) {
    this._valorCoronas = valorCoronas;
  }
}