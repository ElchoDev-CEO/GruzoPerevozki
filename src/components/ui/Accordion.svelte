<script lang="ts">
	interface Item {
		id: string;
		question: string;
		answer: string;
	}

	interface Props {
		items: Item[];
	}

	let { items }: Props = $props();
</script>

<div class="accordion">
	{#each items as item, index (item.id)}
		<details class="accordion__item" open={index === 0}>
			<summary
				class="accordion__trigger"
				id="accordion-question-{item.id}"
				aria-controls="accordion-panel-{item.id}"
			>
				<span class="accordion__question">{item.question}</span>
				<span class="accordion__indicator" aria-hidden="true"></span>
			</summary>
			<div
				class="accordion__panel"
				id="accordion-panel-{item.id}"
				role="region"
				aria-labelledby="accordion-question-{item.id}"
			>
				<p>{item.answer}</p>
			</div>
		</details>
	{/each}
</div>

<style lang="scss">
	.accordion {
		display: flex;
		flex-direction: column;
		gap: 16px;

		&__item {
			background: var(--color-surface);
			border: 1px solid var(--color-line);
			border-radius: var(--radius-lg);
			transition: border-color var(--motion-fast) var(--ease-out);

			&[open] {
				border-color: var(--color-focus);

				.accordion__indicator {
					&::after {
						transform: translate(-50%, -50%) rotate(0deg);
					}
				}
			}

			.accordion__trigger {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 16px;
				min-height: 64px;
				padding: 16px 20px;
				color: var(--color-ink);
				font-weight: 600;
				text-align: left;
				cursor: pointer;
				list-style: none;

				&::-webkit-details-marker {
					display: none;
				}

				&::marker {
					content: '';
				}

				&:focus-visible {
					border-radius: calc(var(--radius-lg) - 2px);
					outline: 3px solid var(--color-focus);
					outline-offset: 3px;
				}

				.accordion__question {
					min-width: 0;
					overflow-wrap: anywhere;
					text-wrap: pretty;
				}

				.accordion__indicator {
					position: relative;
					flex: 0 0 20px;
					width: 20px;
					height: 20px;
					color: var(--color-focus);

					&::before,
					&::after {
						position: absolute;
						top: 50%;
						left: 50%;
						width: 14px;
						height: 2px;
						border-radius: 2px;
						background: currentColor;
						content: '';
						transform: translate(-50%, -50%);
					}

					&::after {
						transition: transform var(--motion-fast) var(--ease-out);
						transform: translate(-50%, -50%) rotate(90deg);
					}
				}
			}

			.accordion__panel {
				padding: 0 20px 20px;
				color: var(--color-ink-muted);
				line-height: 1.65;

				p {
					max-width: 68ch;
				}
			}
		}

		@media (prefers-reduced-motion: reduce) {
			&__item {
				transition: none;

				.accordion__trigger {
					.accordion__indicator {
						&::after {
							transition: none;
						}
					}
				}
			}
		}
	}
</style>
