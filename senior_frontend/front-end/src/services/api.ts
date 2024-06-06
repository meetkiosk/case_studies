import axios from 'axios';
import { Indicator } from '../types';

const API_URL = 'http://localhost:8080';

export class ApiService {
  async fetchIndicators(granularity: string): Promise<Indicator[]> {
    const response = await axios.get(`${API_URL}/indicators?granularity=${granularity}`);
    return response.data.results;
  }
}