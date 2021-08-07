const jsonTree = function(data, config) {
  const id = config.id || 'id'
  const pid = config.pid || 'pid'
  const children = config.children || 'children'
  const idMap = []
  const jsonTree = []
  data.forEach(v => {
    idMap[v[id]] = v
  })
  data.forEach(v => {
    const parent = idMap[v[pid]]
    if (parent) {
      !parent[children] && (parent[children] = [])
      parent[children].push(v)
    } else {
      jsonTree.push(v)
    }
  })

  return jsonTree
}
export default jsonTree
