const obj = {
  name: "Eyob",
  arrowFunc: () => {
    console.log(this.name);
  },
  regularFunc: function () {
    console.log(this.name);
  },
};

const refer = obj.regularFunc;
console.log(refer.bind(obj)());
