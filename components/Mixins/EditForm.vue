<script>
import actions from '@/enums/actions'

export default {
    props: {
        selectedId: {
            type: Number,
            default: 0
        }
    },
    methods: {
        fillForm( newId ) {},
        updateMethod(store, {data: { res } }) {
            const query = {query: this.$store.getters.query };

            const data = store.readQuery( query )

            if( this.$store.state.action === actions.CREATE )
            {
                data[ this.$store.getters.catalogId ].push(res)
            }

            if( this.$store.state.action === actions.DELETE )
            {
                let index = data[ this.$store.getters.catalogId ].findIndex( obj => obj.id === res.id )
                data[ this.$store.getters.catalogId ].splice(index, 1)
            }

            store.writeQuery({ ...query, data, })
        }
    },
    watch: {
      selectedId: function (newId, oldId) { 
          if (this.$store.state.action !== actions.DELETE)
              this.fillForm( newId )
      }
    }
}
</script>