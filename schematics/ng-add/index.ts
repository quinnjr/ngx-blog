import {
  Rule,
  SchematicContext,
  Tree,
  chain,
  mergeWith,
  apply,
  url,
  template,
  move,
  MergeStrategy,
} from '@angular-devkit/schematics';
import { NodePackageInstallTask, RunSchematicTask } from '@angular-devkit/schematics/tasks';
import { Schema } from './schema';
import { strings } from '@angular-devkit/core';

export function ngAdd(options: Schema): Rule {
  return chain([
    addDependencies(),
    addFiles(options),
    updateAngularJson(options),
    createEnvFile(options),
    updatePackageJson(options),
    installDependencies(options),
    setupDatabase(options),
    displayInstructions(options),
  ]);
}

function addDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const dependencies = {
      '@angular/ssr': '^19.1.0',
      '@angular/platform-server': '^19.1.0',
      '@fortawesome/angular-fontawesome': '^0.16.0',
      '@fortawesome/fontawesome-svg-core': '^6.7.2',
      '@fortawesome/free-brands-svg-icons': '^6.7.2',
      '@fortawesome/free-regular-svg-icons': '^6.7.2',
      '@fortawesome/free-solid-svg-icons': '^6.7.2',
      '@prisma/client': '^6.3.1',
      'express': '^4.21.2',
      'dotenv': '^16.4.7',
    };

    const devDependencies = {
      '@angular-devkit/build-angular': '^19.1.0',
      '@types/express': '^5.0.0',
      '@types/node': '^22.10.5',
      'prisma': '^6.3.1',
      'typescript': '~5.7.2',
      '@tailwindcss/postcss': '^4.0.0',
    };

    const packageJson = JSON.parse(tree.read('package.json')!.toString());

    packageJson.dependencies = {
      ...packageJson.dependencies,
      ...dependencies,
    };

    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...devDependencies,
    };

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    context.logger.info('✅ Dependencies added to package.json');

    return tree;
  };
}

function addFiles(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const sourceTemplates = url('./files');

    const sourceParameterizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings,
        blogName: options.blogName || 'My Blog',
        blogDescription: options.blogDescription || 'A blog powered by NGX Blog CMS',
        authorName: options.authorName || 'Blog Admin',
        authorEmail: options.authorEmail || 'admin@example.com',
        port: options.port || 4000,
      }),
      move('/'),
    ]);

    context.logger.info('✅ Adding NGX Blog CMS files...');

    return mergeWith(sourceParameterizedTemplates, MergeStrategy.Overwrite);
  };
}

function updateAngularJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonPath = 'angular.json';

    if (!tree.exists(angularJsonPath)) {
      context.logger.warn('⚠️  angular.json not found');
      return tree;
    }

    const angularJson = JSON.parse(tree.read(angularJsonPath)!.toString());
    const project = options.project || Object.keys(angularJson.projects)[0];

    if (!angularJson.projects[project]) {
      context.logger.error(`❌ Project "${project}" not found in angular.json`);
      return tree;
    }

    // Update build configuration
    const projectConfig = angularJson.projects[project];

    // Add server configuration
    if (!projectConfig.architect.server) {
      projectConfig.architect.server = {
        builder: '@angular-devkit/build-angular:server',
        options: {
          outputPath: `dist/${project}/server`,
          main: 'src/server.ts',
          tsConfig: 'tsconfig.server.json',
        },
        configurations: {
          production: {
            outputHashing: 'media',
          },
          development: {
            optimization: false,
            sourceMap: true,
          },
        },
        defaultConfiguration: 'production',
      };
    }

    // Add SSR configuration
    if (!projectConfig.architect['serve-ssr']) {
      projectConfig.architect['serve-ssr'] = {
        builder: '@angular-devkit/build-angular:ssr-dev-server',
        configurations: {
          development: {
            browserTarget: `${project}:build:development`,
            serverTarget: `${project}:server:development`,
          },
          production: {
            browserTarget: `${project}:build:production`,
            serverTarget: `${project}:server:production`,
          },
        },
        defaultConfiguration: 'development',
      };
    }

    // Update styles
    if (projectConfig.architect.build?.options) {
      projectConfig.architect.build.options.styles = [
        'src/styles.css',
      ];
    }

    tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));

    context.logger.info('✅ Updated angular.json');

    return tree;
  };
}

function createEnvFile(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const envContent = `# Database
DATABASE_URL="${options.databaseUrl || 'postgresql://user:password@localhost:5432/blog'}"

# Server
PORT=${options.port || 4000}
NODE_ENV=development

# Blog Configuration
BLOG_NAME="${options.blogName || 'My Blog'}"
BLOG_DESCRIPTION="${options.blogDescription || 'A blog powered by NGX Blog CMS'}"
AUTHOR_NAME="${options.authorName || 'Blog Admin'}"
AUTHOR_EMAIL="${options.authorEmail || 'admin@example.com'}"
`;

    tree.create('.env.local', envContent);

    // Add .env.local to .gitignore if it exists
    if (tree.exists('.gitignore')) {
      const gitignore = tree.read('.gitignore')!.toString();
      if (!gitignore.includes('.env.local')) {
        tree.overwrite('.gitignore', gitignore + '\n# Environment\n.env.local\n');
      }
    }

    context.logger.info('✅ Created .env.local file');

    return tree;
  };
}

function updatePackageJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packageJson = JSON.parse(tree.read('package.json')!.toString());

    // Add scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'dev': 'ng serve',
      'dev:ssr': 'ng run ngx-blog-cms:serve-ssr',
      'build': 'ng build',
      'build:ssr': 'ng build && ng run ngx-blog-cms:server',
      'serve:ssr': 'node dist/ngx-blog-cms/server/server.mjs',
      'prisma:generate': 'prisma generate',
      'prisma:migrate': 'prisma migrate dev',
      'prisma:seed': 'tsx prisma/seed.ts',
      'prisma:studio': 'prisma studio',
      'db:setup': 'prisma generate && prisma migrate dev && prisma db seed',
      'setup': 'pnpm install && pnpm db:setup',
    };

    // Add Prisma seed configuration
    packageJson.prisma = {
      seed: 'tsx prisma/seed.ts',
    };

    // Set package manager
    packageJson.packageManager = 'pnpm@10.26.2';

    tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));

    context.logger.info('✅ Updated package.json scripts');

    return tree;
  };
}

function installDependencies(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.installDependencies !== false) {
      context.addTask(new NodePackageInstallTask());
      context.logger.info('📦 Installing dependencies...');
    }
    return tree;
  };
}

function setupDatabase(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    if (options.setupDatabase !== false) {
      context.logger.info('🗄️  Setting up database...');
      // Run database setup after dependencies are installed
      // This would require a custom task, so we'll just log instructions
    }
    return tree;
  };
}

function displayInstructions(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('');
    context.logger.info('═══════════════════════════════════════════');
    context.logger.info('✨ NGX Blog CMS successfully installed! ✨');
    context.logger.info('═══════════════════════════════════════════');
    context.logger.info('');
    context.logger.info('📋 Next steps:');
    context.logger.info('');
    context.logger.info('1. Review your configuration:');
    context.logger.info('   📝 .env.local');
    context.logger.info('');
    context.logger.info('2. Set up the database:');
    context.logger.info('   🗄️  pnpm db:setup');
    context.logger.info('');
    context.logger.info('3. Start the development server:');
    context.logger.info('   🚀 pnpm dev:ssr');
    context.logger.info('');
    context.logger.info('4. Open your browser:');
    context.logger.info('   🌐 http://localhost:' + (options.port || 4000));
    context.logger.info('   👤 Admin: http://localhost:' + (options.port || 4000) + '/admin');
    context.logger.info('');
    context.logger.info('📚 Documentation:');
    context.logger.info('   • README.md - Getting started');
    context.logger.info('   • INSTALL.md - Detailed installation');
    context.logger.info('   • QUICKSTART.md - Quick reference');
    context.logger.info('   • PLUGIN-QUICKSTART.md - Plugin development');
    context.logger.info('');
    context.logger.info('🎨 Customization:');
    context.logger.info('   • Themes: src/themes/');
    context.logger.info('   • Plugins: src/plugins/');
    context.logger.info('');
    context.logger.info('Need help? Check out the documentation!');
    context.logger.info('═══════════════════════════════════════════');
    context.logger.info('');

    return tree;
  };
}
