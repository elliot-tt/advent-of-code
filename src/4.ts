import {readLines} from "./util/readFile";
import {hideBin} from "yargs/helpers";
import yargs from "yargs";

function main() {
    const argv = yargs(hideBin(process.argv))
        .command('score-total <input>', "Adds up the total points for a list of scratch cards")
        .positional('input', {
            type: 'string'
        })
        .demandCommand()
        .parseSync();

    const command = argv._[0];

    switch (command) {
        case 'score-total':
            scoreTotal(argv.input as string);
            break;
        default:
            throw new Error(`Yargs knows this one but I don't! ${command}`)
    }
}

const pattern = new RegExp(/Card.*: ([\d\s]*)\|([\d\s]*)/)

type Card = {
    winning: number[]
    has: number[]
    score: number
}

function card(line: string): Card {
    const match = pattern.exec(line)
    if (!match) {
        throw new Error(`We must match! ${line}`)
    }
    const winning =  match[1].trim().split(/\s+/).map(x => Number.parseInt(x))
    const has =  match[2].trim().split(/\s+/).map(x => Number.parseInt(x))
    return {
        winning,
        has,
        score: score(winning, has),
    }
}

function score(winning: number[], has: number[]): number {
    const _has = new Set(has);
    winning.forEach(x => _has.delete(x));
    if (has.length === _has.size) {
        // No winners
        return 0;
    }
    const winners = has.length - _has.size;
    return winners;
    // return Math.pow(2, winners - 1);
}

function scoreTotal(path: string) {
    let count = 0;
    const total = readLines(path)
        .map(card)

    const multiples = total.map(x => 1);

    total.forEach((card, index) => {
        for (let i = index+1; i < card.score+index+1 && i < multiples.length; i++) {
            multiples[i] += multiples[index];
        }
    })

    console.log(total.map(({score}) => score))
    console.log(multiples);
    console.log(multiples.reduce((a,b) => a+b, 0));
}

if (require.main === module) {
    main();
}
