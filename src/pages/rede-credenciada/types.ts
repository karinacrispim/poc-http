export interface Provider {
  urlSlug: string;
  imageUrl: string;
  name: string;
  unitsQuantity: number;
}

export interface ProvidersResponse {
  totalOfProviders: number;
  providers: Provider[];
}

export interface Loading {
  isLoading: boolean;
}

export interface ResponseError {
  error: Error | null;
}
