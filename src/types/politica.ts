export interface Politica {
    fechaVigencia: string; 
    tiempoReembolso: number;
  }
  
  export type PoliticaFormData = Politica;
  
  export const DEFAULT_FORM_DATA: PoliticaFormData = {
    fechaVigencia: "",
    tiempoReembolso: 0,
  };
  