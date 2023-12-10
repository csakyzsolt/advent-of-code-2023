/** 
* Read the input file as text.
*/
export async function readInput(fileName: string): Promise<string> {
  console.info('Solving for input file', fileName);
  return await Deno.readTextFile(fileName);
}