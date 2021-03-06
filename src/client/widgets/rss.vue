<template>
<MkContainer :show-header="props.showHeader">
	<template #header><Fa :icon="faRssSquare"/>RSS</template>
	<template #func><button class="_button" @click="setting"><Fa :icon="faCog"/></button></template>

	<div class="ekmkgxbj">
		<MkLoading v-if="fetching"/>
		<div class="feed" v-else>
			<div class="item" v-for="item in items" :key="item.link">
				<a :href="item.link" rel="nofollow noopener" target="_blank" :title="item.title">{{ item.title }}</a>
				<button class="share" @click="share(item)">
					<fa :icon="faShareSquare" />
				</button>
			</div>
		</div>
	</div>
</MkContainer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { faRssSquare, faCog, faShareSquare } from '@fortawesome/free-solid-svg-icons';
import MkContainer from '@/components/ui/container.vue';
import define from './define';
import * as os from '@/os';

const widget = define({
	name: 'rss',
	props: () => ({
		showHeader: {
			type: 'boolean',
			default: true,
		},
		url: {
			type: 'string',
			default: 'http://feeds.afpbb.com/rss/afpbb/afpbbnews',
		},
	})
});

export default defineComponent({
	extends: widget,
	components: {
		MkContainer
	},
	data() {
		return {
			items: [],
			fetching: true,
			clock: null as number | null,
			faRssSquare, faCog, faShareSquare
		};
	},
	mounted() {
		this.fetch();
		this.clock = window.setInterval(this.fetch, 60000);
		this.$watch(() => this.props.url, this.fetch);
	},
	beforeUnmount() {
		clearInterval(this.clock);
	},
	methods: {
		fetch() {
			fetch(`https://api.rss2json.com/v1/api.json?rss_url=${this.props.url}`, {
			}).then(res => {
				res.json().then(feed => {
					this.items = feed.items;
					this.fetching = false;
				});
			});
		},
		share(item: { title: string, link: string, description: string, content: string }) {
			const desc = item.description || item.content;
			const initialText = desc ? `${item.title}\n\n${desc}\n\n${item.link}` : `${item.title}\n\n${item.link}`;
			os.post({ initialText, instant: true });
		}
	}
});
</script>

<style lang="scss" scoped>
.ekmkgxbj {
	> .feed {
		padding: 0;
		font-size: 0.9em;

		> a {
			display: block;
			padding: 8px 16px;
			color: var(--fg);
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;

			.share {
				display: block;
				width: 32px;
				height: 100%;
				background: transparent;
				font-size: 16px;
				border: 0px solid transparent;
				color: var(--fg);
				cursor: pointer;
				outline: none;
				&:hover {
					opacity: 0.7;
				}
			}
		}
	}
}
</style>
