/**
 * para executar um decorador precisa colocar um @ com nome da function que está tudo que modifica a classe, esse será a function de decorator
 * ai assim que coloca o @ ele já executa, mesmo antes da classe criada ele já vai modifia-la, só que só vai ter algum efeito se ela for criada, se
 * caso for criada e não executada não faz sentido ter um
 *
 * lembrando que decoradores servem para alterar valores das classes
 */

@decorator
export class Animal {
  constructor(
    public name: string,
    public color: string
  ) {}
}

//aqui essa função tem um tipo T que estende uma função construtora anonima, essa função tem args que é array de any, retorna any, isso tudo no tipo
//o parametro da função decorator é target que tem tipo T
function decorator<T extends new (...args: any[]) => any>(target: T): T {
  //retorna uma classe anonima que estende o parametro target esse parametro é a classe Animal que está sendo criada como decorator
  return class extends target {
    name: string;
    color: string;

    //como construtores tem spred de array de any
    constructor(...args: any[]) {
      super(...args); //super retorna o construtor de animal, que tem name e color
      this.name = this.reverse(args[0]); //vai pegar o name de Animal e colocar o método reverse(args[0] -> vai ser o primeiro indice do array)
      this.color = this.reverse(args[1]); //vai pegar o color de Animal e colocar o método reverse(args[1] -> vai ser o segundo indice do array)
    }

    //reverse(valor tipo string)
    reverse(value: string) {
      //retorna o valor.split('' -> passa indice a indice e coloca em array).reverse(inverte os índices).join(''-> junta o array en string)
      return value.split('').reverse().join('');
    }
  };
}

//só precisa instanciar a classe animal e colocar os parâmetros
const animal = new Animal('dog', 'black');
console.log(animal);
