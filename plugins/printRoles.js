import Vue from 'vue'

Vue.filter('printRoles', ( roles ) => ( roles || [] )
                        .map( rol => rol.name)
                        .sort()
                        .join(', ')
          )