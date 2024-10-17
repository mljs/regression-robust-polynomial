/**
 * @ignore
 * @param x
 * @param y
 * @param degree
 * @returns
 */
export function getRandomTuples(x: number[], y: number[], degree: number) {
  const len = Math.floor(x.length / degree);
  const tuples = new Array<Array<{ x: number; y: number }>>(len);

  for (let i = 0; i < x.length; i++) {
    let pos = Math.floor(Math.random() * len);

    let counter = 0;
    while (counter < x.length) {
      if (!tuples[pos]) {
        tuples[pos] = [
          {
            x: x[i],
            y: y[i],
          },
        ];
        break;
      } else if (tuples[pos].length < degree) {
        tuples[pos].push({
          x: x[i],
          y: y[i],
        });
        break;
      } else {
        counter++;
        pos = (pos + 1) % len;
      }
    }

    if (counter === x.length) {
      return tuples;
    }
  }
  return tuples;
}
