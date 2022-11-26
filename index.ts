import { join } from 'path';
import { writeFileSync } from 'fs';
import { faker } from '@faker-js/faker';

// faker.locale = 'pt_BR';

const tab = (vezes: number = 1) => '\t'.repeat(vezes);
const computaApostrofe = (nome: string) => nome.replace(`'`, `''`);

const geraNomes = (maximo: number = 50, sexo?: 'male' | 'female') => {
  const nomes: string[] = [];

  for (let i = 0; i < maximo; ++i) {
    const nome = computaApostrofe(faker.name.firstName(sexo));
    nomes.includes(nome) ? --i : nomes.push(nome);
  }

  const sobrenomes: string[] = [];

  for (let i = 0; i < maximo; ++i) {
    const sobrenome = computaApostrofe(faker.name.lastName(sexo));
    sobrenomes.includes(sobrenome) ? --i : sobrenomes.push(sobrenome);
  }

  const formatarNome = (nomes: string[]) => nomes.map((nome) => `${tab()}SELECT '${nome}'\n`).join(`${tab()}UNION ALL\n`);

  let arquivo = `(\n${formatarNome(nomes)}) A CROSS JOIN (\n${formatarNome(sobrenomes)}) B`;

  const path = join(__dirname, 'sql', 'nomes.sql');
  writeFileSync(path, arquivo);
}

const geraEnderecos = (maximo: number = 30, endereco: 'Rua' | 'Bairro' | 'Cidade') => {
  let funcao;

  switch(endereco) {
    case 'Rua':
    case 'Bairro':
      funcao = faker.address.street;
      break;

    case 'Cidade':
      funcao = faker.address.city;
      break;
  }
  
  let arquivo = tab(2) + `CASE ROUND(RANDOM() * ${maximo})\n`;

  for (let i = 0; i <= maximo; ++i) {
    if (endereco === 'Cidade') {
      arquivo += tab(3) + `WHEN ${i} THEN '${computaApostrofe(funcao()) + ' - ' + faker.address.stateAbbr()}'\n`;
    } else {
      arquivo += tab(3) + `WHEN ${i} THEN '${endereco} ${computaApostrofe(funcao())}'\n`;
    }
  }

  arquivo += tab(2) + `END ${endereco.toLowerCase()}`;

  let nomeArquivo = endereco.toLowerCase() + 's.sql';

  const path = join(__dirname, 'sql', nomeArquivo);
  writeFileSync(path, arquivo);  
}

const quantidadePessoas = 2500;
const maximo = Math.round(quantidadePessoas ** .5);

geraNomes(maximo);
geraEnderecos(quantidadePessoas, 'Rua');
geraEnderecos(quantidadePessoas * .05, 'Bairro');
geraEnderecos(quantidadePessoas * .01, 'Cidade');