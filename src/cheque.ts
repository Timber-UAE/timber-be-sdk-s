import { AxiosInstance, AxiosProgressEvent, AxiosResponse, CancelToken } from 'axios';
import { getFormData } from './utils/getFormData';

export interface ChequeData {
  file: File | string;
  // eslint-disable-next-line no-unused-vars
  progressCallback?: (progressEvent: AxiosProgressEvent) => void;
  cancelToken?: CancelToken;
}

export interface Cheque extends ChequeData {
  _id: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChequeQueryParams {
  page?: number;
  limit?: number;
}

/**
 * Service for Cheque
 *
 * @example
 * ```ts
 * const { createClient } = require('timber-sdk-dev');
 * const client = createClient('your-api-key');
 * const cheque = await client.cheque.list({ page: 1, limit: 10 });
 * console.log(cheque.data);
 * ```
 */

export class ChequeService {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /**
   * Fetch a paginated list of cheques.
   *
   * @param params - Query options like page, limit, filters, sort.
   * @returns List of cheques matching the query.
   *
   * @example
   * ```ts
   * const cheques = await client.cheque.list({ page: 1, limit: 5 });
   * console.log(cheques.data);
   * ```
   */

  async list(params: ChequeQueryParams = {}): Promise<AxiosResponse<Cheque[]>> {
    return await this.http.get<Cheque[]>('/customer/reconcile/cheque', { params });
  }

  /**
   * Create a new cheque.
   *
   * @param data - Cheque creation payload
   * @returns The created cheque
   *
   * @example
   * ```ts
   * const newCheque = {
   *   file: File,
   * };
   * const response = await client.cheque.create(newCheque);
   * console.log(response.data);
   * ```
   */
  async create(data: ChequeData): Promise<AxiosResponse<Cheque>> {
    const { formData, headers } = await getFormData();
    if (data?.file) {
      formData.append('file', data.file);
    } else {
      throw new Error('File is required');
    }
    return await this.http.post<Cheque>('/customer/reconcile/cheque', formData, {
      headers,
      cancelToken: data.cancelToken,
      onUploadProgress: data.progressCallback,
    });
  }
}
