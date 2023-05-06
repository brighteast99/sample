// Enums to prevent typos

const questionTypes = {
  MultipleChoice: "MultipleChoice",
  Descriptive: "Descriptive",
  LikertScale: "LikertScale",
};
Object.freeze(questionTypes);

const responseTypes = {
  Survey: "Survey",
  Test: "Test",
};
Object.freeze(responseTypes);

const cookieData = {
  uuid: "uuid",
};
Object.freeze(cookieData);

const canvasBackground = {
  default: "/background.png",
  left: "/background_L.png",
  right: "/background_R.png",
};
Object.freeze(canvasBackground);

const problemAnswer = {
  left: "Left",
  right: "Right",
};
Object.freeze(problemAnswer);

exports.questionTypes = questionTypes;
exports.responseTypes = responseTypes;
exports.cookieData = cookieData;
exports.objectImage = "objectImage";
exports.canvasBackground = canvasBackground;
exports.problemAnswer = problemAnswer;
