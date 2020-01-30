<template>
<section class="_card" v-if="enableTwitterIntegration || enableDiscordIntegration || enableGithubIntegration">
	<div class="_title"><fa :icon="faShareAlt"/> {{ $t('integration') }}</div>
	<div class="_content" v-if="enableTwitterIntegration">
		<header><fa :icon="faTwitter"/> Twitter</header>
		<p v-if="$store.state.i.twitter">{{ $t('connectedTo') }}: <a :href="`https://twitter.com/${$store.state.i.twitter.screenName}`" rel="nofollow noopener" target="_blank">@{{ $store.state.i.twitter.screenName }}</a></p>
		<mk-button v-if="$store.state.i.twitter" @click="disconnectTwitter">{{ $t('disconnectSerice') }}</mk-button>
		<mk-button v-else @click="connectTwitter">{{ $t('connectSerice') }}</mk-button>
	</div>

	<div class="_content" v-if="enableDiscordIntegration">
		<header><fa :icon="faDiscord"/> Discord</header>
		<p v-if="$store.state.i.discord">{{ $t('connectedTo') }}: <a :href="`https://discordapp.com/users/${$store.state.i.discord.id}`" rel="nofollow noopener" target="_blank">@{{ $store.state.i.discord.username }}#{{ $store.state.i.discord.discriminator }}</a></p>
		<mk-button v-if="$store.state.i.discord" @click="disconnectDiscord">{{ $t('disconnectSerice') }}</mk-button>
		<mk-button v-else @click="connectDiscord">{{ $t('connectSerice') }}</mk-button>
	</div>

	<div class="_content" v-if="enableGithubIntegration">
		<header><fa :icon="faGithub"/> GitHub</header>
		<p v-if="$store.state.i.github">{{ $t('connectedTo') }}: <a :href="`https://github.com/${$store.state.i.github.login}`" rel="nofollow noopener" target="_blank">@{{ $store.state.i.github.login }}</a></p>
		<mk-button v-if="$store.state.i.github" @click="disconnectGithub">{{ $t('disconnectSerice') }}</mk-button>
		<mk-button v-else @click="connectGithub">{{ $t('connectSerice') }}</mk-button>
	</div>
</section>
</template>

<script lang="ts">
import Vue from 'vue';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';
import { faTwitter, faDiscord, faGithub } from '@fortawesome/free-brands-svg-icons';
import i18n from '../../i18n';
import { apiUrl } from '../../config';
import MkButton from '../../components/ui/button.vue';

export default Vue.extend({
	i18n,

	components: {
		MkButton
	},

	data() {
		return {
			apiUrl,
			twitterForm: null,
			discordForm: null,
			githubForm: null,
			enableTwitterIntegration: false,
			enableDiscordIntegration: false,
			enableGithubIntegration: false,
			faShareAlt, faTwitter, faDiscord, faGithub
		};
	},

	created() {
		this.$root.getMeta().then(meta => {
			this.enableTwitterIntegration = meta.enableTwitterIntegration;
			this.enableDiscordIntegration = meta.enableDiscordIntegration;
			this.enableGithubIntegration = meta.enableGithubIntegration;
		});
	},

	mounted() {
		if (!document.cookie.match(/i=(\w+)/)) {
			document.cookie = `i=${this.$store.state.i.token}; path=/;` +
			` domain=${document.location.hostname}; max-age=31536000;` +
			(document.location.protocol.startsWith('https') ? ' secure' : '');
		}
		this.$watch('$store.state.i', () => {
			if (this.$store.state.i.twitter) {
				if (this.twitterForm) this.twitterForm.close();
			}
			if (this.$store.state.i.discord) {
				if (this.discordForm) this.discordForm.close();
			}
			if (this.$store.state.i.github) {
				if (this.githubForm) this.githubForm.close();
			}
		}, {
			deep: true
		});
	},

	methods: {
		connectTwitter() {
			this.twitterForm = window.open(apiUrl + '/connect/twitter',
				'twitter_connect_window',
				'height=570, width=520');
		},

		disconnectTwitter() {
			window.open(apiUrl + '/disconnect/twitter',
				'twitter_disconnect_window',
				'height=570, width=520');
		},

		connectDiscord() {
			this.discordForm = window.open(apiUrl + '/connect/discord',
				'discord_connect_window',
				'height=570, width=520');
		},

		disconnectDiscord() {
			window.open(apiUrl + '/disconnect/discord',
				'discord_disconnect_window',
				'height=570, width=520');
		},

		connectGithub() {
			this.githubForm = window.open(apiUrl + '/connect/github',
				'github_connect_window',
				'height=570, width=520');
		},

		disconnectGithub() {
			window.open(apiUrl + '/disconnect/github',
				'github_disconnect_window',
				'height=570, width=520');
		},
	}
});
</script>