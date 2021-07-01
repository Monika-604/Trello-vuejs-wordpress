<template>
	<v-card :loading="loading" color="grey lighten-3" v-if="item">
		<v-card-title>
			<h3 contenteditable @blur="e => updatePost({'post_title': e.currentTarget.innerText, 'ID': item.id})" class="font-weight-bold" v-text="item.title.rendered" />
			<v-spacer></v-spacer>
			<v-btn icon @click="removePost(item.id)" :loading="loading">
				<v-icon>mdi-delete</v-icon>
			</v-btn>
			<v-btn icon @click="$emit('closeModal')">
				<v-icon>mdi-close</v-icon>
			</v-btn>
		</v-card-title>
		<v-card-text>
			<b>Description:</b>
			<v-textarea v-model="description" class="mt-3" @blur="updatePost({'post_excerpt': description, 'ID': item.id})" :loading="updateLoading" :disabled="updateLoading" flat solo filled placeholder="Enter Description of card"></v-textarea>
		</v-card-text>
		<v-card-text>
			<b>Activities</b>
			<v-text-field v-model="comment" @keyup="e => e.key === 'Enter' ? this.createComment() : ''" :loading="addCommentLoading" class="mt-3" flat solo filled dense placeholder="Enter Comment" />
		</v-card-text>
		<v-card-text>
			<v-list color="transparent">
				<v-list-item class="white my-2" v-for="(item, i) in comments" :key="i">
					<v-list-item-avatar>
						<v-icon large>mdi-account</v-icon>
					</v-list-item-avatar>
					<v-list-item-content>
						<v-list-item-title v-text="item.author_name" />
              <datetime type="datetime" v-text="item.date" />
						<v-list-item-subtitle contenteditable @blur="e => updateComment({'comment_content': e.currentTarget.innerText, 'comment_ID': item.id})" class="mt-1" v-html="item.content.rendered" />
					</v-list-item-content>
					<v-list-item-action>
						<v-btn icon @click="removeComment(item.id)">
							<v-icon>mdi-delete</v-icon>
						</v-btn>
					</v-list-item-action>
				</v-list-item>
			</v-list>
		</v-card-text>
	</v-card>
</template>

<script lang='js'>
import { Datetime } from 'vue-datetime';
import {get, post} from "axios";

export default {
  components:{
    datetime: Datetime
  },
	props: {
		item: {
			type: Object,
			default: () => null
		}
	},
	data() {
		return {
			comments: [],
			comment: '',
			loading: false,
			addCommentLoading: false,
			updateLoading: false,
			description: '',
		}
	},
	mounted() {
		if (this.item) {
			this.description = this.item.excerpt.rendered
			this.getComments(this.item.id)
		}
	},
	methods: {
		async getComments(id) {
			this.loading = true
			try {
				const response = await get(this.$store.getters.API + '/comments?post=' + id)
				this.comments = response.data
			} catch (e) {
				console.log(e.toString())
			} finally {
				this.loading = false
			}
		},
		async createComment() {
			this.addCommentLoading = true
			try {
				const response = await post(this.$store.getters.API + '/comment/create',
					`comment=${this.comment}&post_id=${this.item.id}`,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
				if (response.data) {
					this.comment = ''
					this.getComments(this.item.id)
				}
			} catch (e) {
				console.log(e.toString())
			} finally {
				this.addCommentLoading = false
			}
		},
		async removeComment(id) {
			this.loading = true
			try {
				const response = await post(this.$store.getters.API + '/comment/remove',
					`comment_id=${id}`,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
				if (response.data) {
					this.getComments(this.item.id)
				}
			} catch (e) {
				console.log(e.toString())
			} finally {
				this.loading = false
			}
		},
		async removePost(id) {
			this.loading = true
			try {
				const response = await post(this.$store.getters.API + '/post/remove',
					`post_id=${id}`,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
				if (response.data) {
					this.$emit('postRemoved')
				}
			} catch (e) {
				console.log(e.toString())
			} finally {
				this.loading = false
			}
		},
		async updatePost(data) {
			this.updateLoading = true
			let dataString = ''
			for(let i in data) {
				dataString += `${i}=${data[i]}&`
			}
			try {
				await post(this.$store.getters.API + '/post/edit',
					dataString,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
			} catch (e) {
				console.log(e.toString())
			} finally {
				this.updateLoading = false
			}
		},
		async updateComment(data) {
			this.updateLoading = true
			let dataString = ''
			for(let i in data) {
				dataString += `${i}=${data[i]}&`
			}
			try {
				await post(this.$store.getters.API + '/comment/edit',
					dataString,
					{
						headers: {
							'content-type': 'application/x-www-form-urlencoded'
						},
					}
				)
			} catch (e) {
				console.log(e.toString())
			} finally {
				this.updateLoading = false
			}
		}

	}
}
</script>

<style scoped>

</style>
