import { toast } from "react-toastify";
/*
 * Toggles to the next piece of data
 * @param {object} the class component or function component
 * if object is class component just use 'this' keyword
 * else send array object with state e.g. [index, setIndex, array]
 * */
const handleNext = (object) => {
  try {
    if (object.isReactComponent) {
      const { index, data } = object.state;
      if (index === data.length - 1) return;
      object.setState((prevState) => ({
        index: prevState.index + 1,
      }));
    } else {
      const [index, setIndex, data] = object;
      if (index === data.length - 1) return;
      setIndex(index + 1);
    }
  } catch (err) {
    toast.info("Det finns för närvarande inga fler tillfällen att visa.");
  }
};

/*
 * Toggles to the previous piece of data
 * @param {object} the class component or function component
 * if object is class component just use 'this' keyword
 * else send array object with state e.g. [index, setIndex, array]
 * */
const handlePrevious = (object) => {
  try {
    if (object.isReactComponent) {
      const { index } = object.state;
      if (index === 0) return;
      object.setState((prevState) => ({ index: prevState.index - 1 }));
    } else {
      const [index, setIndex] = object;
      if (index === 0) return;
      setIndex(index - 1);
    }
  } catch (err) {
    toast.info("Det finns för närvarande inga föregående tillfällen att visa.");
  }
};

export default {
  next: handleNext,
  prev: handlePrevious,
};
