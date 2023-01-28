const Crafting = class {
  constructor(inventory, stopAt = 8) {
      this.rarities = 'Common,Unusual,Rare,Epic,Legendary,Mythic,Ultra,Super'.split(',')
      this.normal = [0.6, 0.4, 0.2, 0.1, 0.03, 0.01, 0.01]
      this.skilled = [0.9, 0.6, 0.3, 0.15, 0.03, 0.01, 0.01]
      this.stopAt = stopAt
    
      this.oldInventory = this.rarities.reduce((r, i) => ({...r, [i]: inventory[i]}), {})
      this.newInventory = this.rarities.reduce((r, i) => ({...r, [i]: inventory[i]}), {})
  }
  init(skilled = false) {
    return this.craft(skilled ? this.skilled : this.normal)
    /*for (let [i, [rarity, amount]] of Object.entries(this.newInventory).entries())
      console.log(`${amount} of ${rarity} crafted successfully.`)*/
  }
  craft(type) {
    for (let [i, [rarity, amount]] of Object.entries(this.newInventory).entries()) {
      if (i === this.stopAt) break
      while (this.newInventory[rarity] >= 5) {
        let craft = Math.random() <= type[i]
        if (craft) {
          this.newInventory[rarity] -= 5
          if (rarity !== 'Super')
            this.newInventory[this.rarities[i + 1]] += 1
        } else {
          this.newInventory[rarity] -= Math.floor(Math.random() * 4)
        }
      }
    }
    return Object.entries(this.newInventory)
  }
  analytics() {
    let normal = this.rarities.reduce((r, i) => ({...r, [i]: []}), {})
    let skilled = this.rarities.reduce((r, i) => ({...r, [i]: []}), {})
    for (let i = 0; i < 100; i++) {
      for (let [rarity, amount] of this.craft(this.normal)) {
        normal[rarity].push(amount)
        this.newInventory = this.oldInventory
      }
      for (let [rarity, amount] of this.craft(this.skilled)) {
        skilled[rarity].push(amount)
        this.newInventory = this.oldInventory
      }
    }
    let normalAverage = this.rarities.reduce((r, i) => ({...r, [i]: Math.floor(normal[i].reduce((a, b) => a + b) / normal[i].length)}), {})
    let skilledAverage = this.rarities.reduce((r, i) => ({...r, [i]: Math.floor(skilled[i].reduce((a, b) => a + b) / skilled[i].length)}), {})
    let normalvsskilled = this.rarities.reduce((r, i) => ({...r, [i]: skilledAverage[i] - normalAverage[i]}), {})
    console.log(normalvsskilled)
  }
}

export default Crafting
