function buildStoreObj(data) {
  try {
    return data._embedded.storeList.map((s) => ({
      id: s.id,
      store: s.properties.store,
      address: s.properties.address,
      openingHours: s.properties.openingHours,
      picUrl: s.properties.picUrl,
      website: s.properties.website,
      isFocused: false,
      city: s.properties.city,
      province: s.properties.province,
      coordinates: s.geometry.coordinates.reverse(),
    }));
  } catch (ex) {}
}

function buildWeatherObj(data) {
  try {
    return {
      id: data.current.weather[0].id,
      temp: data.current.temp,
      humidity: data.current.humidity,
      description: data.current.weather[0].description,
      icon: data.current.weather[0].icon,
      forecast: [data.daily],
    };
  } catch (ex) {}
}

function buildTrafficObj(data) {
  try {
    return data.StopLocation.map((t) => ({
      id: t.id,
      name: t.name,
      coordinates: [t.lat, t.lon],
      products: t.products,
      weight: t.weight,
    }));
  } catch (ex) {}
}

function buildDepartureObj(data) {
  try {
    return data.Departure.map((d) => ({
      operator: d.Product.operator,
      date: d.date,
      time: d.time,
      transportNumber: d.transportNumber,
      stopId: d.stopid,
    }));
  } catch (ex) {}
}

export default {
  buildStoreObj,
  buildWeatherObj,
  buildTrafficObj,
  buildDepartureObj,
};
