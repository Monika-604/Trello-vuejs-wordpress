<template>

	<div class="lists">
		<v-card v-for="(item, i) in items" flat :key="i">
			<v-card-text class="d-flex justify-space-between align-center">
				<h3 v-text="item.name" contenteditable @blur="e => updateCategory({'name': e.currentTarget.innerText, 'cat_ID': item.id})" />
				<v-spacer />
				<v-btn icon @click="removeCategory(item.id)" >
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</v-card-text>
			<v-card-text>
				<v-btn @click="currentPost = post; showCardModal = true" block class="my-1 justify-start" depressed v-for="(post, j) in item.posts" :key="j">
					{{post.title.rendered}}
				</v-btn>
			</v-card-text>
			<v-card-text>
				<v-btn link @click="currentCategory = item; showAddPost = !showAddPost" color="white grey--text" depressed>
					<v-icon left>mdi-plus</v-icon>
					Add new card
				</v-btn>
			</v-card-text>
		</v-card>
		<v-card flat class="grey lighten-1 text-center">
			<v-card-text>
				<v-btn @click="showAdd = !showAdd" class="grey lighten-1 font-weight-black text-capitalize" dark depressed>Add new list</v-btn>
				<v-text-field @keyup="e => e.key === 'Enter' ? this.createCategory() : ''" class="my-2" v-show="showAdd" filled dense solo flat v-model="newCategoryName" placeholder="List Name: " />
			</v-card-text>
		</v-card>
		<v-bottom-sheet v-model="showAddPost">
			<v-card>
				<v-card-title>Add new card to {{currentCategory ? currentCategory.name : ''}}</v-card-title>
				<v-card-text>
					<v-text-field @keyup="e => e.key === 'Enter' ? this.CreatePost() : ''" class="my-2" filled dense solo flat v-model="newPostName" placeholder="Card Name: " />
				</v-card-text>
			</v-card>
		</v-bottom-sheet>
		<v-dialog v-model="showCardModal" persistent v-if="currentPost">
			<Card :item="currentPost" @closeModal="closeModal" @postRemoved="afterPostRemoved" />
		</v-dialog>
	</div>
</template>

<script>
import {get, post} from "axios";
import Card from "@/components/Card";

export default {
	components: {Card},
	data() {
		return {
			showAdd: false,
			newCategoryName: '',
			showAddPost: '',
			newPostName: '',
			currentCategory: null,
			currentPost: null,
			showCardModal: false,
			items: []
		}
	},

	mounted(){
		this.getCategories()
	},

	methods: {
		async getCategories(){
			try {
				const response = await get(this.$store.getters.API + '/categories')
				response.data = response.data.reverse()
				this.items = response.data
				for (const item of this.items) {
					try {
						item.posts = await this.getPosts(item.id)
					} catch (e) {
						console.log(e.toString())
					}
				}
				this.$forceUpdate()
			} catch (e) {
				console.log(e.toString())
			}
		},

		async getPosts(id) {
			try {
				const response = await get(this.$store.getters.API + '/posts?categories=' + id)
				return response.data
			} catch (e) {
				console.log(e.toString())
			}
		},

		async createCategory() {
			try {
				const response = await post(this.$store.getters.API + '/category/create',
					`name=${this.newCategoryName}`,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
				if (response.data) {
					this.getCategories()
					this.newCategoryName = ''
					this.showAdd = false
				}
			} catch (e) {
				console.log(e.toString())
			}
		},
		async CreatePost() {
			try {
				const response = await post(this.$store.getters.API + '/post/create',
					`name=${this.newPostName}&category_id=${this.currentCategory.id}`,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
				if (response.data) {
					this.getCategories()
					this.newPostName = ''
					this.showAddPost = false
				}
			} catch (e) {
				console.log(e.toString())
			}
		},
		async removeCategory(id) {
			this.loading = true
			try {
				const response = await post(this.$store.getters.API + '/category/remove',
					`category_id=${id}`,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
				if (response.data) {
					this.getCategories()
				}
			} catch (e) {
				console.log(e.toString())
			} finally {
				this.loading = false
			}
		},
		async updateCategory(data) {
			let dataString = ''
			for(let i in data) {
				dataString += `${i}=${data[i]}&`
			}
			try {
				await post(this.$store.getters.API + '/category/edit',
					dataString,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
			} catch (e) {
				console.log(e.toString())
			}
		},
		closeModal() {
			this.showCardModal=false;
			this.currentPost = null
		},
		afterPostRemoved() {
			this.closeModal()
			this.getCategories()
		}
	}
}
</script>

<style scoped lang="scss">
.lists {
	display: flex;
	align-content: center;
	width: 100%;
	& > .v-card {
		width: 280px;
		min-width: 280px;
		margin: 0 6px;
		height: fit-content;
	}
}
</style>
