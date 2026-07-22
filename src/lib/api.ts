export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8787') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getProjects(): Promise<any[]> {
    return this.request<any[]>('/api/projects');
  }

  async getAchievements(): Promise<any[]> {
    return this.request<any[]>('/api/achievements');
  }

  async getStats(): Promise<any> {
    return this.request<any>('/api/stats');
  }

  async triggerGitHubSync(): Promise<any> {
    return this.request<any>('/api/sync/github', {
      method: 'POST',
    });
  }

  async triggerCTFtimeSync(): Promise<any> {
    return this.request<any>('/api/sync/ctftime', {
      method: 'POST',
    });
  }
}

export const api = new ApiClient();
