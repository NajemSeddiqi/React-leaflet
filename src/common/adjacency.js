const handleNext = (object, idx = 0) => {
  if (object.isReactComponent) {
    console.log("hel");
    const { index, data } = object.state;
    if (index === data.length - 1) return;
    object.setState((prevState) => ({ index: prevState.index + 1 }));
  } else {
    const [index, setIndex, data] = object;
    if (index === data.length - 1) return;
    setIndex(index + 1);
  }
};

const handlePrevious = (object, idx = 0) => {
  if (object.isReactComponent) {
    const { index } = object.state;
    if (index === 0) return;
    object.setState((prevState) => ({ index: prevState.index - 1 }));
  } else {
    const [index, setIndex] = object;
    if (index === 0) return;
    setIndex(index - 1);
  }
};

export default {
  next: handleNext,
  prev: handlePrevious,
};
