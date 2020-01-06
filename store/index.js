import acts from '@/enums/actions'
import cat from '@/enums/catalogos'

export const state = () => ({
    action: 0,
    catalog: undefined,
    document: undefined,
    fileList: [],
    image: undefined,
    mutation: undefined,
    query: undefined,
    selectedItem: {},
    token: null,
})

export const mutations = {
    changeAction(state, newAction) {
        state.action = newAction
    },
    changeSelectedItem(state, selectedItem) {
        state.selectedItem = selectedItem
    },
    changeField(state, {key, value}){
        state.selectedItem[key] = value
    },
    changeCatalog(state, catalog){
        state.catalog = catalog
    },
    changeQuery(state, query){
        state.query = query
    },
    changeMutation(state, mutation){
        state.mutation = mutation
    },
    updateName(state, value){
        state.selectedItem.name = value
    },
    updateDescription(state, value){
        state.selectedItem.description = value
    },
    updateImage(state, image){
        state.image = image
    },
    updateDocument(state, doc){
        state.document = doc
    },
    addVideo(state, video){
        state.selectedItem.videos.push( video )
    },
    updateVideo(state, {index, value}) {
        state.selectedItem.videos[index].vimeo_id = value
    },
    setVideoAsPreview(state, idx) {
        state.selectedItem.videos[idx].is_preview = 1
    },
    setVideoName(state, {idx, newName}){
        delete state.selectedItem.videos[idx].__typename
        state.selectedItem.videos[idx].name = newName
    },
    updateVideoList(state, videoList) {
        state.selectedItem.videos = videoList
    },
    updateArrayList(state, {key, list}) {
        state.selectedItem[key] = list
    },
    addItemToList(state, {key, item}){
        if(!state.selectedItem[key]) {
            state.selectedItem[key] = []
        }
        state.selectedItem[key].push(item);
    },
    removeItemFromList(state, {key, deletedId}){
        const list = state.selectedItem[key]
        list.splice(list.findIndex(p => p.id === deletedId), 1)
    },
    addFile(state, {idx, file}) {
        state.fileList.splice(idx, 1, file)
    },
    updateTipoProducto(state, id){
        state.selectedItem.tipoProducto = {id}
    },
    updateToken(state, token){
        state.token = token
    },
    updateArrObjProp(state, {arr, idx, prop, value}){
        state.selectedItem[arr][idx][prop] = value
    },
}

export const getters = {
    banners: state => state.selectedItem.banners ? state.selectedItem.banners : undefined,
    catalog: state => state.catalog ? state.catalog : cat.MEMBRESIAS ,
    catalogId: state => state.catalog ? state.catalog.id : undefined ,
    gqlContext: state => state.token ? {headers: {'Authorization': `Bearer ${localStorage.getItem('apollo-token')}`}}  : undefined,
    description: state => state.selectedItem ? state.selectedItem.description : undefined,
    document: state => state.document ? state.document : undefined,
    docName: state => state.document ? state.document.name : undefined,
    fileList: state => state.fileList ? state.fileList : [],
    field: state => key => state.selectedItem ? state.selectedItem[key] : undefined,
    image: state => state.image ? state.image : undefined,
    imageName: state => state.image ? state.image.name : undefined,
    mutation: state => state.mutation ? state.mutation : undefined,
    name: state => state.selectedItem ? state.selectedItem.name : undefined,
    query: state => state.query ? state.query : undefined,
    selectedItemId: state => state.selectedItem ? state.selectedItem.id : -1,
    tipoProductoId: state => state.selectedItem ? state.selectedItem.tipoProducto.id : 1,
    videos: state => state.selectedItem.videos ? state.selectedItem.videos.filter( video => video.vimeo_id !== null) : [],
    videosLength: state => state.selectedItem ? state.selectedItem.videos.length : 0,
    vimeoId: state => idx => state.selectedItem.videos[idx].vimeo_id,
}

export const actions = {
    manageAction({state, commit}, {action, item , mutation}){
        commit('changeAction', action)
        commit('changeSelectedItem', item)
        if(mutation){
            commit('changeMutation', mutation)
        }
    },
    manageFile({state, commit}, file){
        let idx = (/\.(gif|jpg|jpeg|tiff|png)$/i).test(file.name) ? 0 : 1
        commit('addFile', {idx, file})
    },
    updateVideoProps({commit}, {idx, name}){
        let suffix = idx === 0 ? ' - Preview' : ` - Video ${idx}` 
        let newName = `${name} ${suffix}` 
        
        if( idx === 0 ) {
            commit('setVideoAsPreview', idx)
        }
        
        commit('setVideoName', {idx, newName})
    }
}