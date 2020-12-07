const data = {
  dates: ["1/22/20", "2/11/20", "3/27/20"],
  countryData: {
    China: [548, 44386, 81897],
    "United Kingdom": [0, 8, 14745],
    "United States": [1, 11, 101657],
    "United xStates": [1, 0, 0],
  },
};

const day = 2;

const output = Object.entries(data.countryData)
  .map(([country, dataArray]) => {
    return {
      country,
      value: dataArray[day],
    };
  })
  .filter(({ value }) => value)
  .sort((a, b) => b.value - a.value);

console.log(output);
