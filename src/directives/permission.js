const permission = {
  inserted: function(el, binding) {
    const elRoles = binding.value
    const userRoles = localStorage.getItem('roles').split(',')
    const role = elRoles.find(item => userRoles.includes(item))
    if (!role) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
export default permission
