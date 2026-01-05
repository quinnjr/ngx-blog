export interface Schema {
  project?: string;
  blogName?: string;
  blogDescription?: string;
  authorName?: string;
  authorEmail?: string;
  databaseUrl?: string;
  port?: number;
  setupDatabase?: boolean;
  installDependencies?: boolean;
}
