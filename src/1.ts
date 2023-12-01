import {readLines} from "./util/readFile";
import {hideBin} from "yargs/helpers";
import yargs from "yargs";
import {PathLike} from "node:fs";
import {read} from "fs";

const argv = yargs(hideBin(process.argv))
    .command('sum-calibration <input>', "Sums the two digit numbers made by the first and last digit of each line")
    .positional('input', {
        type: 'string'
    })
    .demandCommand()
    .parseSync();

const command = argv._[0];

switch (command) {
    case 'sum-calibration':
        sumCalibration(argv.input as string);
        break;
    default:
        throw new Error(`Yargs knows this one but I don't! ${command}`)
}

function sumCalibration(path: PathLike) {
    const lines = readLines(path);
    const digitWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    function reverse(s: string) : string {
        return s.split("").reverse().join("");
    }
    function digitOrDigitWordToDigitString(digit: string) : string {
        if (Number.isInteger(Number.parseInt(digit))) {
            return digit;
        }
        return `${digitWords.indexOf(digit) + 1}`;
    }
    function twoDigit(line: string): number {
        const pattern = RegExp(`(\\d|${digitWords.join("|")})`)
        const revPattern = RegExp(`(\\d|${digitWords.map(x => x.split("").reverse().join("")).join("|")})`)
        const firstDigitString = pattern.exec(line);
        const lastDigitString = revPattern.exec(reverse(line));
        if (!firstDigitString || !lastDigitString) {
            throw new Error(`Regex must always match ${line}`);
        }
        const firstDigit = digitOrDigitWordToDigitString(firstDigitString[1]);
        const lastDigit = digitOrDigitWordToDigitString(reverse(lastDigitString[1]));
        console.log([firstDigit, lastDigit]);
        return Number.parseInt(`${firstDigit}${lastDigit}`)
    }
    console.log(lines.map(twoDigit).reduce((a,b) => a+b, 0));
}

