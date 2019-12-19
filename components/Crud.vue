<script>
import actions from '@/enums/actions'
import ApolloCrud from '@/components/ApolloCrud'
export default {
    components: {
        ApolloCrud
    },
    data() {
        return {
            baseObj: null,
            fields: [],
            
            createMutation: null,
            updateMutation: null,
            deleteMutation: null,
        }
    },
    methods: {
        changeMutation({action}){
            let mutation = null

            switch (action) {
                case actions.CREATE: 
                    mutation = this.createMutation
                    break
                case actions.UPDATE:
                    mutation = this.updateMutation
                    break;
                case actions.DELETE:
                    mutation = this.deleteMutation 
                    break
            }

            this.$store.commit('changeMutation', mutation )
        },
    }
}
</script>