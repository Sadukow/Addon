// class describes downloads for specified window
(function(){

	const FILE_IMAGES = {
		// loading
		20:  "data:image/gif;base64,R0lGODlhEgASAMQaAHl5d66urMXFw3l5dpSUk5WVlKOjoq+vrsbGw6Sko7u7uaWlpbm5t3h4doiIhtLSz4aGhJaWlsbGxNHRzrCwr5SUkqKiobq6uNHRz4eHhf///wAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQFCgAaACwAAAAAEgASAAAFaqAmjmRplstyrkmbrCNFaUZtaFF0HvyhWRZNYVgwBY4BEmFJOB1NlYpJoYBpHI7RZXtZZb4ZEbd7AodFDIYVAjFJJCYA4ISoI0hyuUnAF2geDxoDgwMnfBoYiRgaDQ1WiIqPJBMTkpYaIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo4aRZEoeaxHOiqKFsyBtizopV9ynfwJ0o43MhgNKAYjZbGQJBLXKBLRIK4IaWFbEHgFUoKYoPFKRZUK6fFIORwojBxDytgzpDkdANDc8SQTExp8fBoQEGcDiwNnJA0NLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOmqKQKHmtVzpKksa2FIUiOKIxjHb8B5JgKCAFjgHUMHUkPR6u0WKhwVgx0YQ2ccW6DGCDZjKJiiwWEgCQikRQ6zWpQC+QBviBxuHQEP4EKA0NGhmGGRoVFWaHiGYjEBAuIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6aJJEoiaxIOj6PJsyCpigopmNyff0X0o43AgZJk0mKwSABAK4RhaJ5PqOH7GHAHUQD4ICm0YiKwCSHI7VYoDLwDClBT5Di8khEY+gbUBAQGgWEBRoWFmYEiwRmJBUVLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaO2vOQKImtWDoCgMa2koTCsDZNGuIjpIFwQBIYBahGI2UkORyukUKhyVgz0Yv2csW6thcNBBIVMRikSCRFoaAK8ALpQD+QCHiCZrHQBP4BKBUVGgmGCX6BUQaMBmUkFhYuIQAAIfkEBQoAGgAsAQABABAAEAAABWagJo4aAJAoaZrp6DjaIA/a86BZnmlNo2FADEm3GwWFJAgkNZmQIpHWSCLRFK4FKWKLIHgJUoFYoKlUpCIxabFIKRSohDxButgvJIPeoKFQNHd4JBYWGgeHBxoMDGgBjgFoJI4tIQAAIfkEBQoAGgAsAQABABAAEAAABWSgJo6a45Aoma1ZOkaRxrYAgBZ4oUGQVtckgpBAGhgHqEol1WiQFgvX6PHQJK4JKWaLMXgNWq7GYpGKJhMShZKSSFCH+IGEqCNIgXxAo1BoBIACKHkaF4YXf4JSh4hmIwwMLiEAACH5BAUKABoALAEAAQAQABAAAAVloCaOWhSRKFmsRToui0bMhOY4aKInWlVpmWCGZCgaSMIhyWJJQSAkCsU1AgA0h+yBarUGvgHqYDzQfKmiRoOkUKQeD9RlfiFh7hgSvS6RaPB5JAwMGgiGCBoTE2gCjQJoJI0uIQAAOw==",
		// spacer
		24:  "data:image/gif;base64,R0lGODlhAQABAPAAAAAAAP///yH5BAEAAAEALAAAAAABAAEAAAICTAEAOw==",
		// WOT
		50:  "data:image/gif;base64,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",
		51:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJrSURBVDgRBcG9a11lHADg533Puffmpjc3TZP6kRpNnRQUpHQoKN3cdJBOoqPoKIiDSDdREBwcBBddnHSwg/4HFko7iGLBiLEEk6jEfNjefN177jnn5/OkiH0kZJSoqdbpXl5he8n0gNTds//ZlnKZ7ionvzBZIxVKEjJK9ND7QDF/3eEX4v5tTncxIy1dpOh/KPeuyyW5QJYi/kOJ/gXG20Zfi61PxJ+/yQ1KBM2YdHYgrb6wl84+f8nk7pYgRYzQW6HZdPCp+ON9aQ8LmEUHgTFGNCPS48/Kjz2XCCniBP01R988FeuvSjvBQ5z8W9i9c/5O9aATuePK3OrYuWd2lZl6l7Rw8Ua9fXgtRUxXxMGmzVfEr7ekRerW0fpXT8wNLlSqUUfbxCBlhzNzPHxlR6dbme4uiGYmZcprTn/i/i2pQI9ywYsig5RCKhxJ3qvGHNx9RNtmefaYXFzKWDReY4oeMlq3n35nw8rr/2imCUGKb9s2tE2Y7C0oOhU5tRlJHBLIgBYtWnKHopuUPQAiMhnINt7YV54nIxDgZcH09wXLlyeGy/TnvZUzuUNORJ2hyDa//NzpDv0uLXGM5DvJk4IIovVSU3m3e4beDGV/rK368GNWGrv38Q3Fo8ziiGbjjPrv4T0pRiFGuUjfNzX9YdYZkIuxph5+JE2luAmYiuiQEk6oTwaaat7ksDR+0Cp79IbMDEdCcdDW3UUoJUBH38RfzXH/XDMZaluqo5LE7FLW7dXKwb62Gtxsm/5VAqEEkIyxWAxPX0vT0zej7lwtB6WElCu5bH7Q9XYzmftZIAEpIgAAAAAAAADA/2/zDM6sh6jfAAAAAElFTkSuQmCC",
		52:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAJoSURBVDgRBcE/a5wFHADg5/fee7lccqFpLw21jVgjQSQVikgn6yii4uI3kIKDdSkOol0tdDRbhn6DJotCwamKKA4WiqiJok1MU7SNSS5J8+/ufX8+T2QmAAAAAAAAACitrBBBo0FZ0mx+bn//U5ubrP7Nb7+i4NKrtFo3tFqfefiQXg9ErqxQFDSbUyLWrK1x5w5fzPHfBgBw4QJXrmyYnZ2ytXWkrkWurtJs0mikpSXm5lhYYPwUExO0hqkqdnd5/A/9Y65e3fDW26dlTa6tycePb+e9e5nXrmWSeX46N2Zn8qtnh36Yn/Tn/KS8+1wney+czzzZzSRzZmaxQuSjR8Pq+sDdu1z9iHbb4WTXrfWfx2Y67b31wwPBaIa9RsWb7XMmN/fY7UmiUJbv2dpidZXtLbpdgyLfxR4h0AhPy/BJXfL9zrqjzghRCF4ptFov6fXY3qY9QlnqNDtffjjzmjfOXVIjgwgLRcHxEGsHPYaHoS6tr4dMBgPGxohAIok02meooBFsDxFBraYoQZHXr39jfJx2m7PPUFeE9wWDP5a9czTm5Sec3fVBHbQqykEyqKBR5OLi17mwwJkzTE1xcEDELUXxfBahLkJduNRr+biZnDhkrAr6x/BTAXnz5rzjY6an6XS4f1/9+9JfGo3MIjJLPz4ZYWKf7hETVU1d38gIUQEUxcbg9cvd8lRX8WCF5WX2n3rQ5JcTdPqcPuRsP5zM2CS7iagAkCzt8uJOgxgd8e/RPkG7plMxXnMi4zvyciKhQoUKAyQX+3y7S+6QOyGfhuxzO7lYR6hRoUJkJgAAAAAAAAD4H/SHFMwzl/h9AAAAAElFTkSuQmCC",
		53:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAKUSURBVDgRBcFLb1RVAADg75wzM8zQ1g60iDSUJjWGsiGBhYYoBEncmDSRgDtdunbFT2DhD3BrXBIXEBOMC3WjibExkkqCRUlAbMqzD6Yz03n03nv8vpBfvQJCJEag+4KZE/MGOzPGA1I9+uOnO47OUW+x84RRH0ENhEiMpDop3dScuGx9lQd/0u2QEkcXaLZuSgeuqNXYTyDkToeYqNXn5Lzh6T1+vc2tG/T3SAmBqmJ+geWPWXjruP7uhpyFvNulVj+OdY9+57uv+fEHmgdpNIgJqCqKgv0RH37Eu5eaqmoUcq9PrbHm2dqS77/i1i0mJr3s7rq7sb6yOyLwzuGDwem5Be12m/GYhcVfPLh/IeS94bxi9J873/LlF4wKQ6F3++79qdmppDcqhWAyZ91Qcuq1KYtLJyn2qapWlGpXdJ7z4iGdHqmuOTH5AQhBiMSol5LlXOfxVtdgc4d6g3rjfNRIs/a26XVIiRDIfrv63jkXz55TVuSM4J8YKRo8/XeDlIjxYg2oUNFqATlTVVSlVoN6IqaYu8NKCIy7Q0IgCDFfu7am3abVZO4NZHK1LFcMe94/ecqZ+XknDk1dzqiVtJo1gG9CSTPcvjEIB55w7x6rf7E3JKXFXI4f7Zdj/VHv7YdbWysvtgeO9Fg81Hb47BJFGSKG1dVPb+btgtdneXOB6Unkh2LIYsjDqlrZ7AxMj5jeoz1/jJyvQygAml6WV87PNs6fZucVzzbp971cf+z+o3XNAe0BRw62tC+d2VYUM8pKKAIykFnbS5YGx+qqmSlbT7fFSB2tMVN9ppfP/m2isaQoqbKaiIyM5NRk6ZPm8/3P9je3L0wkQiBlUuHn+sjn5FU5k5GzkHMGAAAAAAAAAP8DaLQe+Y+YcacAAAAASUVORK5CYII=",
		54:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALUSURBVBgZpcFLa1xlGMDx//Oc9z2XuSU60RZMQ6nQZBFKFMRtP4GLZiO4EOtKN7oVslQ3fgEroisXLgyKoiAKLgrBVqtUauqNxJq0cZpJJ5lJzsy5vI+JC7+Av5/sVzuAIAgiDqNkWGzSTRefHJZ3QlkdoOrUa/vG1uFXxDrNqNxgWG8jKA4EQRBxRBKn4D+ItXVpc/gxd/PrjKs+Ko6p+BzTfm7VSbqs6pE6QgA5qHqIRESSLAUb/7B9+CU3B+/z28E3IDVeFTNhEipa7hSLU89wKluc3S83tzGQYbWLajyLVX/9cfAha/ffYlD+SSdp0IwTJrkSMJLUGJYF+/mY852LzLWeEjNDRvUDVJP1u6OvF9bur3Avv0W3MUVvy/Pdj/LZgwGPeMfTM48aFy4Y092afp7Tjh5b3ck3l52Im53Uewt3Dj9h6+gnHk46+JBufPqFnZs7I8TemBxJq7djw2uFMX9emD2bsZfvXPKaoIp/+aD4nV7+LZHEZC6lk7nnQEAEUSFyjIqJXC5yZesejEeeNPJE4pY0El8fVlvkk11ijXESEUzWXnvVc/lZz15PGB8JoZSr5QTqUugPwEcRInLRKSohTKjMEIsAwQKEGkIwIg+RF1QwxVCBYIZyQnp6vf/GeuJmiF1CNU4IBiL2IsfWbjnmn0g583hMNu1WfAo+hsgZdeDEbf1+9/WP9ibrdJJZiiJlux8hwrsqnFXADCzwgoo932gbScNIMyhC4NgN9doY3+y/s5q603RbwmA/5vNrGWs/+w0Bw8RGE3mv3SxoTxmtTiDLAlWwN8VArvx6mhNF0N0I6Y4PY/4epPQGyiiHyMZkUU7WDDQ7gc5Dho/tl1Dbghk4IeJEpPVMUYfbR+5oXptKV4XpSsHAx4bPjEbTUOztqpaXMP7lQBCOmYLZQidJljJfr5RtW7YQMEDEej7Sq7G4V4ZluYXxHzEz/o9/ANxiTAFCMJzoAAAAAElFTkSuQmCC",
		55:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAALYSURBVBgZpcHNa1xVGMDh33vOuffOnbkzk8xkYtNoEBQ/AqXWjYsad26kLmp3Ftz6R+jCTfa6EV3YhSIIQkEFFRcWCSikoonaEGkcYxObpHG+kvm4M3PvedXif+DzSLP7LSAIghWHx9Me73C2eP7p9rTph3kHwZnYJj/83P2EavAQe/2bTHSAYHAgCIIRhzUhTuR65JLLG90Pud36hcG0heColxaoJ3PXAxtdtcalxhtAcIJgxOJMuOiZ7G+ffMHa3vts/H4bbyEMQBWmY0iC2ZfOLS2PlupnF/Pc3lVAdnvrOAkjhXSj9wGf77zFfiujMgdxAtkAUHBFGHah3yry2MI85x5eXlL1e86IxZlgc6d/g6//eJs/OxlzizA+gO33WE+PuYfjUnQGHrgItUeHNO92ODje/uqvVvikMbholJ88/lP3I5rHI6o1cEJ/+03EBjxjQ150guRH9Pe/hKObUGn0GKTyROhsZJwJrrQnuzT732EVoiJMu7zMf8SAsWAsV+0E2regfwRx0sZac8UENlo+me7SHee4CKyB4hnWLr4DF14HJtwnhk8FMB5aO+DCFGN12WwdbMiUlFzBGEBBPQ3NQTMgBolBSswIIAKjUxDrERBz62Dz43JUI3aQT7lP4LIo3NksUFwJiZ8CaryKAwkgKkM+LeBVvrG9878ezsbVN6S0w/HphHEfkirPG8Od05bdSHuKmfpL2SHXVECqUFgQCnGDfBq9YgpBxI2t9VWbPkh5BtIhbH3v+G0zuWaMqhF00HWfqQdmwCeGpF4mG5dXUUVeePcRynHCYafdqsx1asVKn0kKvY4lHSbQmmDaIyiALxnC+Qrzc412No7qqh7nNac7OKEQhvVBu77WOiw960dDZDJGslOMKNpwaBgixZhqZXYtnxSeAw8oTkQQ4R+KGF0pxYULWRS8lvlsRTSfB8Gj96xza07MKt7/iHhUlX+JqvJ//A1wFDc9msFLrQAAAABJRU5ErkJggg==",
		60:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAASCAQAAABcWC4yAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKtJREFUOE+907sNwyAURuF/A0/IWN6KCW6RhxJT2HiGkwLwQxRJcR0dIaGPK+ECC6E4GK04IH8TQsZKrsvgq60/zu1WeSGTySyHUU+rnLf2UU/bbm8dv8jPhFAMxszMjBEDF5jqwVjfxYi4wIQKJBKJsvc3GYmpYqp7f5MxdfmbjHeXv8l4dfmbjGeXvykG43HK8DfFYNxPlVFfEzJup8rb97X/XdP+2xYX2AdgLRGyUqGNNQAAAABJRU5ErkJggg==",
		61:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAASCAQAAABcWC4yAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASNJREFUOI21lEFOwzAQRecGudVsqIRUFixQxAI2CKkXYEEjBOIC2XOgnGAWUAR0QdszfOzxJNh1Vx3QkyPreaKvxGMTCEQNY4SaaEBDIxgZ3E414zHwrE9GKhXssLUhe253wB2q+3UWs8STssxiNqEsssleP9ZZTIcHpctithPidhZzP5F/zYi4nWpqGXdKaIHWtrEVfCthG92O0gL11mc9aGTorVf+wOkviyyUNI+fHVkrae5zFANuLWRhcw4FX1a4trm4XIi5qeCwuI+4XIi5rmB8VojLhZjLCsZHhbhciLmoYLxXiMsRvTDOC0JbXwlWBbH/PY6oY8xxNjGPMTPBW0F6/Xin5+a0IJ2b1wJxOo2Z4SQb/xQz3gM83QHp+svxuh9mfrzVkBgxIAAAAABJRU5ErkJggg==",
		62:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAASCAQAAABcWC4yAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAASNJREFUOI21lEFOwzAQRecGudVsqIRUFixQxAI2CKkXYEEjBOIC2XOgnGAWUAR0QdszfOzxJNh1Vx3QkyPreaKvxGMTCEQNY4SaaEBDIxgZ3E414zHwrE9GKhXssLUhe253wB2q+3UWs8STssxiNqEsssleP9ZZTIcHpctithPidhZzP5F/zYi4nWpqGXdKaIHWtrEVfCthG92O0gL11mc9aGTorVf+wOkviyyUNI+fHVkrae5zFANuLWRhcw4FX1a4trm4XIi5qeCwuI+4XIi5rmB8VojLhZjLCsZHhbhciLmoYLxXiMsRvTDOC0JbXwlWBbH/PY6oY8xxNjGPMTPBW0F6/Xin5+a0IJ2b1wJxOo2Z4SQb/xQz3gM83QHp+svxuh9mfrzVkBgxIAAAAABJRU5ErkJggg==",
		63:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAASCAQAAABcWC4yAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATZJREFUOE+VlUFOwzAQRecGuZU3VEJqFyxQxAI2CKkX6IJGCMQFsudAOcEsoAiaBYUzfOzxpE2wjSZ6cmQ9af5EsUchEIgqhwGqgrG7rmIMdEUn2uHR8yxPB8xyjB986+Ki0/ItnoTtKNLmGAcfFziM2vx1Wt7gQWhGkTbHGhjgotPy+yOnSJsLbz7ARSeaaoeN4I+2xizX1YwvwR930ZEGtHp/WhBmuq7VO/WPo/ApAmsh7u0uhvVC3OcdhcI7LV7r3u567DWw1z1nnW9zm2B3+wTOOt/mJsHuPhM463ybqwS7+0jgrPNtLhPs7j2Bs47oxeFigr+u11bH2E0Ic5JzRI3DEqsjy1C+sDrG24TYJnUyN+cT4ozYHON1AhectFngbLRipM3NaDPM9wBmudMPLM573v0CMqobYsKUUOIAAAAASUVORK5CYII=",
		64:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAASCAQAAABcWC4yAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAR9JREFUOE+tlTFOxDAQRecGuZUbVkJaCgoUUUCDkPYCFGyEQFwgPQfKCaaARbApWDjDxzOZZG1ZNB70lMR68ujHyTghEIiagBlqxPjc0DBmBnWqAx4jz3oOgNsxfvBtByOJ2eJJ2Sbl9Y5xiBHCIY/p8KB0SXm9YwsRspj7hWN5vZPVzCQx1AbcKfE1tnC7oWV8KbEF2iUmXnrrlR6Ef3BDb31mjmTZwkaZxj43BYzKNI4xMunWJm5s7HMj9hYy2pjlfm4KfG5foDHXBT73WaAxlwU+91GgMRcFPvdeEGPoJeA8I7bmlccxdhmyd4i6gDXOFtYydeVxjLcMjZHHdpox7Yd6x3jNYNj2XOEkOabyevdHzLyXZ+B2x58a26fzF5JGyprS4Gt8AAAAAElFTkSuQmCC",
		65:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAASCAQAAABcWC4yAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAALtJREFUOI211DEKg0AQRuH/Bt5qmggBU6QIkiJpQmAvYBFFlFzAPjd9KZyYFduRh7B8TrfDCiEVxi8VKN6EkDEw8GZgwGAHc24ZGRlps9FIc+7o6enpstFIc34t/Ucjbb6y2mhoaDBUs4PJf0y+FxNiBxOaIZFIvoTxJiPxdEx+jjcZj03xJuO+Kd5kXDfFm4zLpniTPsZ5laFbtEmdUXFaqjBURpuQcVw1736sCRklh+ybR2PNn7o8drAvQL954SUfLPoAAAAASUVORK5CYII=",
		// undefine
		80:  "data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAATxJREFUKM91kT1uE2EURW9J6SV4CVmCu5QpKZ2OinFJeWtEQfOGGTJWMuOfmQwOGDOKE1f0CIkVoCzBSzgpvgghRN4t33nSuXpCKCMjA/0vQhlpMt79rl25mMYkRpIkIWXAgY4DkHHjjWuXxDHO/wAdHQAHMj76zp+4pCCIk7+AH1zTkdF5yZ6WioUXb2KEhF7TPd1Hu2PBwBcqD+6dnyKhtz9Ti/dtsY1xTBbfb137zmuXD0goXLrxV7fH5B7jxntvXVOAhHLP3fuW4iFVixet791RkSegcOMdNTtStfL04BuuKIhjAmZrPjPnGyv30920d09PzzUXL5PDeUfDnN73bjx4z56BLWvHGAlJF7+CJLrxJUuWNFw5P5OegBjFq9yVVx5oKCn/+Vdyn+SzihUbPhCzOElLJJ6NQOgROBktk7FXYdYAAAAASUVORK5CYII=",
		};
		
	const API_HREF_SERVICE_WOT = "http://api.mywot.com/0.4/public_query2?url=http://";
	const TIMEOUT_WOT = 10000;

	SP_SINGLE_SAFE_WOT = function(  ){

		var self = this;
		
		this.wot = [];
		
		// -------------------  WOT  ------------------------------------------------------------------------
		this.set_PreviewDimensions_WOT = function( div )  {      

			var document = gBrowser.selectedBrowser.contentDocument;
			var divb = document.createElement("div");
			divb.setAttribute("style","position:relative; height:30px; display:block; margin-left:20px;");

			var img = document.createElement("img");
			img.setAttribute("src", FILE_IMAGES[50]);
			img.setAttribute("title", "Check out this URL at WOT");
			img.setAttribute("style","position:absolute; cursor:pointer");
			img.setAttribute("id", "sp_icon_wot");
			img.style.left="0px";
			img.style.top="0px";
			divb.appendChild( img );
			img.addEventListener("click", function( event ){	sp_single.navigate_url('http://www.mywot.com/en/scorecard/'+self.curHost, event);   }, true);
		
			var imgR = document.createElement("img");
			imgR.setAttribute("id", "sp_fullDivTip_wot_r");
			imgR.setAttribute("style","position:absolute; cursor:pointer");
			imgR.style.top="7px";
			imgR.style.left="80px";
			imgR.setAttribute("title", "Refresh");
			imgR.setAttribute("src", FILE_IMAGES[20]);
			divb.appendChild( imgR );
			imgR.addEventListener("click", function( event ){    self.refresh_wot( );   	}, true);
	
			var imgC = document.createElement("img");
			imgC.setAttribute("id", "sp_fullDivTip_wot_c");
			imgC.setAttribute("style","position:absolute; ");
			imgC.style.top="7px";
			imgC.style.left="120px";
			imgC.setAttribute("src", FILE_IMAGES[24]);
			imgC.hidden = true;
			divb.appendChild( imgC );

			div.appendChild( divb );
		}	

		// ===========================================================================================
		//  -----   запрос на WOT
		this.Proverka_WOT = function( host )  {      
			if (  sp_single.branch.getBoolPref('service_wot') )
			{
				setTimeout(function() {   
								self.read_WOT( host, function(  ){  
								
																	self.show_Div_WOT( host );		
																
																} ); 	 
							},  100 );
			}
		}	
		
		// ===========================================================================================
		this.read_WOT =  function( host, callback ){
			if (this.wot[host] != null) 
			{ 
				callback( ); 
				return; 
			}
			
//			var request = Components.classes['@mozilla.org/xmlextras/xmlhttprequest;1'].createInstance(Components.interfaces.nsIXMLHttpRequest);
			var request = new XMLHttpRequest();

			var surl = API_HREF_SERVICE_WOT + host + '/';
	sp_single.alert('read_WOT: '+surl);	
		
			request.open("GET", surl );
			request.send(null);  
		
			request.onreadystatechange = function()			{
					if (request.readyState==4 && request.status==200)
					{
						clearTimeout(self.WOTTimer);
						elems = request.responseXML.getElementsByTagName( 'application' );		

						var rr = '';
		
						for( var i = 0; i != elems.length; i++ )
						{
							var name = elems[i].getAttribute("name") ;
							var r = elems[i].getAttribute("r") ;
							var c = elems[i].getAttribute("c") ;
							
							if ( name == 0) 
							{
								rr = r + '-' + c;
								break;
							}
						}
			sp_single.alert('read_WOT:::: '+rr);	
						
						if ( rr != '')
						{
							self.wot[host]	= rr;
							var current_dt = new Date();
							var current_time = current_dt.getTime();
//							var text = current_time + '; WOT; ' + host + '; ' + rr + '\n';
//							sp_single.storage._write_file(AD_SIGNS_FILE, text, 0);
							sp_single.storage.writeHost( { host: host,	srv:  'WOT',	rez:  self.wot[host], dat: current_time 	} )
						}
						
						callback(  );
					}
				}
			request.onerror = function(){
					sp_single.alert("WOT - Error: "+host) 
					callback( null );
				}
				
			this.WOTTimer = setTimeout( function() { 
		
							sp_single.alert("WOT Time over: "+host) 
							request.abort();   
							
							callback();
							
						}, TIMEOUT_WOT);
	
		}	
	
		// ===========================================================================================
		this.get_Status_WOT = function( v )  {    
			if ( v == null) return { r: 80, c: 24, v: 0 };
			var tmp = v.split("-");
			var rr = 80, cc = 60;
			if (tmp[0] >= 0) rr = 51;
			if (tmp[0] > 20) rr = 52;
			if (tmp[0] > 40) rr = 53;
			if (tmp[0] > 60) rr = 54;
			if (tmp[0] > 80) rr = 55;
			
			if (tmp[1] >=  6) cc = 61;
			if (tmp[1] >= 12) cc = 62;
			if (tmp[1] >= 23) cc = 63;
			if (tmp[1] >= 34) cc = 64;
			if (tmp[1] >= 45) cc = 65;
			
			return { r: rr, c: cc, v: tmp[1] };
		}

		// ===========================================================================================
		this.show_Div_WOT = function( host )  {    
			var status = this.get_Status_WOT( this.wot[host] );
			var document = gBrowser.selectedBrowser.contentDocument;
			var img_wot_r = document.getElementById("sp_fullDivTip_wot_r");
			if ( img_wot_r )
			{
				var imageUrl = FILE_IMAGES[status.r];
				img_wot_r.setAttribute("src", imageUrl);
			}
			var img_wot_c = document.getElementById("sp_fullDivTip_wot_c");
			if ( img_wot_c )
			{
				var imageUrl = FILE_IMAGES[status.c];
				img_wot_c.setAttribute("src", imageUrl);
				img_wot_c.hidden = false;
				img_wot_c.title = status.v;
			}
			if (this.regimTest)
			{
				var div_info = document.getElementById('sp_fullDivTip_info');
				var text = div_info.getAttribute("title");
				text = text + " WOT = " + this.wot[host];
				div_info.setAttribute("title",text);
			}	
		}
	
	
		// ================================================================================================
		this.refresh_wot = function(  )  {    
			this.wot[this.curHost] = null;

			var document = gBrowser.selectedBrowser.contentDocument;
			var img_wot_r = document.getElementById("sp_fullDivTip_wot_r");
			if ( img_wot_r )  img_wot_r.setAttribute("src", FILE_IMAGES[20]);
			var img_wot_c = document.getElementById("sp_fullDivTip_wot_c");
			if ( img_wot_c )  img_wot_c.setAttribute("hidden", true);

			this.Proverka_WOT(this.curHost);
		}
	
		
// ================================================================================================
	}	
})();
