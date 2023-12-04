import {readLines} from "./util/readFile";
import {hideBin} from "yargs/helpers";
import yargs from "yargs";
import {PathLike} from "node:fs";
function main() {
    const argv = yargs(hideBin(process.argv))
        .command('possible-games <input>', "Identifies which games are possible for 12,13,14 RGB cubes")
        .positional('input', {
            type: 'string'
        })
        .demandCommand()
        .parseSync();

    const command = argv._[0];

    switch (command) {
        case 'possible-games':
            possibleGames(argv.input as string);
            break;
        default:
            throw new Error(`Yargs knows this one but I don't! ${command}`)
    }
}


type Round = {
    red: number;
    green: number;
    blue: number;
}

type Game = Round & {
    id: number,
}

const bluePattern = new RegExp(/(\d+) blue/);
const redPattern = new RegExp(/(\d+) red/);
const greenPattern = new RegExp(/(\d+) green/);

function round(roundSpec: string) : Round {
    const blueMatch = bluePattern.exec(roundSpec);
    const redMatch = redPattern.exec(roundSpec);
    const greenMatch = greenPattern.exec(roundSpec);
    console.log(roundSpec);

    const parsed = {
        red: redMatch ? Number.parseInt(redMatch[1]) : 0,
        blue: blueMatch ? Number.parseInt(blueMatch[1]) : 0,
        green: greenMatch ? Number.parseInt(greenMatch[1]) : 0,
    };
    console.log(parsed);
    return parsed;
}

function game(line: string) : Game {
    const [idSpec, roundSpecs] = line.split(":");
    const id = Number.parseInt(idSpec.substring('Game '.length));
    console.log(id);
    const maxRound = roundSpecs.split(";").map(round).reduce((a,b) => {
        return {
            red: Math.max(a.red, b.red),
            blue: Math.max(a.blue, b.blue),
            green: Math.max(a.green, b.green),
        }
    }, {red: 0, green: 0, blue: 0});
    return {id, ...maxRound}
}

function possibleGames(path: string) {
    const total = readLines(path).map(game)
        .filter(({red, blue, green}) => {
        return red <= 12 && green <= 13 && blue <= 14;
    }).map(({id}) => id)
        .reduce((a,b) => a+b, 0);

    console.log(total);
}

if (require.main === module) {
    main();
}