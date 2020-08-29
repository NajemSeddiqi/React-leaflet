export function buildStoreObject(data) {
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
}
