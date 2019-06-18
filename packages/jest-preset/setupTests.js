require("jest-enzyme");
require("jest-extended");
const createSerializer = require("jest-emotion").createSerializer;
const emotion = require("emotion");

require("./matchers");
require("./utils");

expect.addSnapshotSerializer(createSerializer(emotion));

var enzyme = require("enzyme");
var Adapter = require("enzyme-adapter-react-15");

enzyme.configure({ adapter: new Adapter() });
