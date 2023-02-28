module.exports = {
  preset: 'ts-jest/presets/js-with-babel',
  testEnvironment: "node",
  testPathIgnorePatterns: ["dist"],
  transformIgnorePatterns: [ "/Users/antony/Desktop/Nethermind/forta-bot-practice/challenge_two/node_modules/(?!ethers|@adraffy)" ],
};
