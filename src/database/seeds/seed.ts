import { AppDataSource } from '../database.providers'; // Atualize o caminho conforme necessário
import { CreateUsersSeed } from './create-users.seed'; // Atualize o caminho conforme necessário

async function runSeed() {
  try {
    await AppDataSource.initialize();
    const seed = new CreateUsersSeed();
    await seed.run(AppDataSource);
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error running seed:', error);
  } finally {
    process.exit();
  }
}

runSeed();
