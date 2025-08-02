export class Validated {
  role: boolean;
  limit(limit: any) {
    throw new Error('Method not implemented.');
  }
  page(page: any) {
    throw new Error('Method not implemented.');
  }
  query: {
    page?: string;
    limit?: string;
    role?: string;
    search?: string;
  };
  isActive?: string;
}

