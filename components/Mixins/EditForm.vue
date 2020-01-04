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
        fillForm( newId ) {}
    },
    watch: {
      selectedId: function (newId, oldId) { 
          if (this.$store.state.action !== actions.DELETE)
              this.fillForm( newId )
      }
    }
}
</script>