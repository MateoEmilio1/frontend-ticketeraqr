export interface Politica {
    fechaVigencia: string;
    diasReembolso: number;
    estado?: string;
    vigente?: boolean;
}

export interface PoliticaFormData {
    diasReembolso: number;
    fechaVigencia: string;
}
