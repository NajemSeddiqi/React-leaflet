export default function loadProgress(object, seconds) {
  const progressAdditive = 100 / seconds;
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      object.setState((prevState) => ({
        progress: prevState.progress + progressAdditive,
      }));
    }, 1000 * i);
  }
}
