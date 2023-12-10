/** 
* Split the input by whitespaces, trim the parts and parse them as numbers.
*/
export function splitAndParseNumbers(input: string): number[] {
  return input
    .split(' ')
    .filter(item => item.trim() !== '')
    .map(Number);
}