import { mutation } from "./_generated/server"

export const seedGospelParallels = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("gospelParallels").first()
    if (existing) {
      throw new Error("Gospel parallels already seeded. Delete existing data first if you want to re-seed.")
    }

    // Data sourced from Kurt Aland, Synopsis Quattuor Evangeliorum, 13th ed. (1985)
    // via bible-researcher.com. Pericope numbers (§) reference Aland's numbering.
    const parallels = [
      // ── Birth and Childhood ──────────────────────────────────────
      // §6
      { label: "Genealogy of Jesus", passages: [
        { book: "Matthew", chapter: 1, startVerse: 2, endVerse: 17 },
        { book: "Luke", chapter: 3, startVerse: 23, endVerse: 38 },
      ]},
      // §7
      { label: "Birth of Jesus", passages: [
        { book: "Matthew", chapter: 1, startVerse: 18, endVerse: 25 },
        { book: "Luke", chapter: 2, startVerse: 1, endVerse: 7 },
      ]},
      // §8
      { label: "Adoration of the Infant Jesus", passages: [
        { book: "Matthew", chapter: 2, startVerse: 1, endVerse: 12 },
        { book: "Luke", chapter: 2, startVerse: 8, endVerse: 20 },
      ]},
      // §11
      { label: "Childhood at Nazareth", passages: [
        { book: "Matthew", chapter: 2, startVerse: 22, endVerse: 23 },
        { book: "Luke", chapter: 2, startVerse: 39, endVerse: 40 },
      ]},

      // ── Preparation for Ministry ─────────────────────────────────
      // §13
      { label: "John the Baptist", passages: [
        { book: "Matthew", chapter: 3, startVerse: 1, endVerse: 6 },
        { book: "Mark", chapter: 1, startVerse: 2, endVerse: 6 },
        { book: "Luke", chapter: 3, startVerse: 1, endVerse: 6 },
        { book: "John", chapter: 1, startVerse: 19, endVerse: 23 },
      ]},
      // §14
      { label: "John's Preaching of Repentance", passages: [
        { book: "Matthew", chapter: 3, startVerse: 7, endVerse: 10 },
        { book: "Luke", chapter: 3, startVerse: 7, endVerse: 9 },
      ]},
      // §16
      { label: "John's Messianic Preaching", passages: [
        { book: "Matthew", chapter: 3, startVerse: 11, endVerse: 12 },
        { book: "Mark", chapter: 1, startVerse: 7, endVerse: 8 },
        { book: "Luke", chapter: 3, startVerse: 15, endVerse: 18 },
        { book: "John", chapter: 1, startVerse: 24, endVerse: 28 },
      ]},
      // §17
      { label: "Imprisonment of John", passages: [
        { book: "Matthew", chapter: 14, startVerse: 3, endVerse: 4 },
        { book: "Mark", chapter: 6, startVerse: 17, endVerse: 18 },
        { book: "Luke", chapter: 3, startVerse: 19, endVerse: 20 },
      ]},
      // §18
      { label: "Baptism of Jesus", passages: [
        { book: "Matthew", chapter: 3, startVerse: 13, endVerse: 17 },
        { book: "Mark", chapter: 1, startVerse: 9, endVerse: 11 },
        { book: "Luke", chapter: 3, startVerse: 21, endVerse: 22 },
        { book: "John", chapter: 1, startVerse: 29, endVerse: 34 },
      ]},
      // §20
      { label: "The Temptation", passages: [
        { book: "Matthew", chapter: 4, startVerse: 1, endVerse: 11 },
        { book: "Mark", chapter: 1, startVerse: 12, endVerse: 13 },
        { book: "Luke", chapter: 4, startVerse: 1, endVerse: 13 },
      ]},

      // ── Early Galilean Ministry ──────────────────────────────────
      // §32
      { label: "Beginning of Galilean Ministry", passages: [
        { book: "Matthew", chapter: 4, startVerse: 13, endVerse: 17 },
        { book: "Mark", chapter: 1, startVerse: 14, endVerse: 15 },
        { book: "Luke", chapter: 4, startVerse: 14, endVerse: 15 },
        { book: "John", chapter: 4, startVerse: 43, endVerse: 46 },
      ]},
      // §33
      { label: "Rejection at Nazareth", passages: [
        { book: "Matthew", chapter: 13, startVerse: 53, endVerse: 58 },
        { book: "Mark", chapter: 6, startVerse: 1, endVerse: 6 },
        { book: "Luke", chapter: 4, startVerse: 16, endVerse: 30 },
      ]},
      // §34
      { label: "Calling of the First Disciples", passages: [
        { book: "Matthew", chapter: 4, startVerse: 18, endVerse: 22 },
        { book: "Mark", chapter: 1, startVerse: 16, endVerse: 20 },
      ]},
      // §35
      { label: "Teaching in the Synagogue at Capernaum", passages: [
        { book: "Mark", chapter: 1, startVerse: 21, endVerse: 22 },
        { book: "Luke", chapter: 4, startVerse: 31, endVerse: 32 },
      ]},
      // §36
      { label: "Healing of a Demoniac in the Synagogue", passages: [
        { book: "Mark", chapter: 1, startVerse: 23, endVerse: 28 },
        { book: "Luke", chapter: 4, startVerse: 33, endVerse: 37 },
      ]},
      // §37
      { label: "Healing of Peter's Mother-in-Law", passages: [
        { book: "Matthew", chapter: 8, startVerse: 14, endVerse: 15 },
        { book: "Mark", chapter: 1, startVerse: 29, endVerse: 31 },
        { book: "Luke", chapter: 4, startVerse: 38, endVerse: 39 },
      ]},
      // §38
      { label: "Sick Healed at Evening", passages: [
        { book: "Matthew", chapter: 8, startVerse: 16, endVerse: 17 },
        { book: "Mark", chapter: 1, startVerse: 32, endVerse: 34 },
        { book: "Luke", chapter: 4, startVerse: 40, endVerse: 41 },
      ]},
      // §42
      { label: "Cleansing of a Leper", passages: [
        { book: "Matthew", chapter: 8, startVerse: 1, endVerse: 4 },
        { book: "Mark", chapter: 1, startVerse: 40, endVerse: 45 },
        { book: "Luke", chapter: 5, startVerse: 12, endVerse: 16 },
      ]},
      // §43
      { label: "Healing of the Paralytic", passages: [
        { book: "Matthew", chapter: 9, startVerse: 1, endVerse: 8 },
        { book: "Mark", chapter: 2, startVerse: 1, endVerse: 12 },
        { book: "Luke", chapter: 5, startVerse: 17, endVerse: 26 },
      ]},
      // §44
      { label: "Calling of Levi (Matthew)", passages: [
        { book: "Matthew", chapter: 9, startVerse: 9, endVerse: 13 },
        { book: "Mark", chapter: 2, startVerse: 13, endVerse: 17 },
        { book: "Luke", chapter: 5, startVerse: 27, endVerse: 32 },
      ]},
      // §45
      { label: "Question about Fasting", passages: [
        { book: "Matthew", chapter: 9, startVerse: 14, endVerse: 17 },
        { book: "Mark", chapter: 2, startVerse: 18, endVerse: 22 },
        { book: "Luke", chapter: 5, startVerse: 33, endVerse: 39 },
      ]},
      // §46
      { label: "Plucking Grain on the Sabbath", passages: [
        { book: "Matthew", chapter: 12, startVerse: 1, endVerse: 8 },
        { book: "Mark", chapter: 2, startVerse: 23, endVerse: 28 },
        { book: "Luke", chapter: 6, startVerse: 1, endVerse: 5 },
      ]},
      // §47
      { label: "Man with Withered Hand", passages: [
        { book: "Matthew", chapter: 12, startVerse: 9, endVerse: 14 },
        { book: "Mark", chapter: 3, startVerse: 1, endVerse: 6 },
        { book: "Luke", chapter: 6, startVerse: 6, endVerse: 11 },
      ]},
      // §49
      { label: "Choosing of the Twelve", passages: [
        { book: "Matthew", chapter: 10, startVerse: 1, endVerse: 4 },
        { book: "Mark", chapter: 3, startVerse: 13, endVerse: 19 },
        { book: "Luke", chapter: 6, startVerse: 12, endVerse: 16 },
      ]},

      // ── Sermon on the Mount / Plain ──────────────────────────────
      // §51
      { label: "The Beatitudes", passages: [
        { book: "Matthew", chapter: 5, startVerse: 3, endVerse: 12 },
        { book: "Luke", chapter: 6, startVerse: 20, endVerse: 23 },
      ]},
      // §52
      { label: "Salt of the Earth", passages: [
        { book: "Matthew", chapter: 5, startVerse: 13, endVerse: 13 },
        { book: "Mark", chapter: 9, startVerse: 49, endVerse: 50 },
        { book: "Luke", chapter: 14, startVerse: 34, endVerse: 35 },
      ]},
      // §53
      { label: "Light of the World", passages: [
        { book: "Matthew", chapter: 5, startVerse: 14, endVerse: 16 },
        { book: "Mark", chapter: 4, startVerse: 21, endVerse: 21 },
        { book: "Luke", chapter: 8, startVerse: 16, endVerse: 16 },
      ]},
      // §59
      { label: "Love Your Enemies", passages: [
        { book: "Matthew", chapter: 5, startVerse: 43, endVerse: 48 },
        { book: "Luke", chapter: 6, startVerse: 27, endVerse: 36 },
      ]},
      // §62
      { label: "The Lord's Prayer", passages: [
        { book: "Matthew", chapter: 6, startVerse: 7, endVerse: 15 },
        { book: "Luke", chapter: 11, startVerse: 1, endVerse: 4 },
      ]},
      // §67
      { label: "On Anxiety", passages: [
        { book: "Matthew", chapter: 6, startVerse: 25, endVerse: 34 },
        { book: "Luke", chapter: 12, startVerse: 22, endVerse: 32 },
      ]},
      // §68
      { label: "On Judging", passages: [
        { book: "Matthew", chapter: 7, startVerse: 1, endVerse: 5 },
        { book: "Mark", chapter: 4, startVerse: 24, endVerse: 25 },
        { book: "Luke", chapter: 6, startVerse: 37, endVerse: 42 },
      ]},
      // §70
      { label: "God's Answering of Prayer", passages: [
        { book: "Matthew", chapter: 7, startVerse: 7, endVerse: 11 },
        { book: "Luke", chapter: 11, startVerse: 9, endVerse: 13 },
      ]},
      // §73
      { label: "By Their Fruits", passages: [
        { book: "Matthew", chapter: 7, startVerse: 15, endVerse: 20 },
        { book: "Luke", chapter: 6, startVerse: 43, endVerse: 45 },
      ]},
      // §75
      { label: "House Built on Rock", passages: [
        { book: "Matthew", chapter: 7, startVerse: 24, endVerse: 27 },
        { book: "Luke", chapter: 6, startVerse: 47, endVerse: 49 },
      ]},

      // ── Miracles and Ministry ────────────────────────────────────
      // §85
      { label: "The Centurion's Servant", passages: [
        { book: "Matthew", chapter: 8, startVerse: 5, endVerse: 13 },
        { book: "Luke", chapter: 7, startVerse: 1, endVerse: 10 },
        { book: "John", chapter: 4, startVerse: 46, endVerse: 54 },
      ]},
      // §90
      { label: "Stilling the Storm", passages: [
        { book: "Matthew", chapter: 8, startVerse: 23, endVerse: 27 },
        { book: "Mark", chapter: 4, startVerse: 35, endVerse: 41 },
        { book: "Luke", chapter: 8, startVerse: 22, endVerse: 25 },
      ]},
      // §91
      { label: "The Gadarene Demoniac", passages: [
        { book: "Matthew", chapter: 8, startVerse: 28, endVerse: 34 },
        { book: "Mark", chapter: 5, startVerse: 1, endVerse: 20 },
        { book: "Luke", chapter: 8, startVerse: 26, endVerse: 39 },
      ]},
      // §95
      { label: "Jairus' Daughter and the Woman with a Hemorrhage", passages: [
        { book: "Matthew", chapter: 9, startVerse: 18, endVerse: 26 },
        { book: "Mark", chapter: 5, startVerse: 21, endVerse: 43 },
        { book: "Luke", chapter: 8, startVerse: 40, endVerse: 56 },
      ]},
      // §106
      { label: "John the Baptist's Question", passages: [
        { book: "Matthew", chapter: 11, startVerse: 2, endVerse: 6 },
        { book: "Luke", chapter: 7, startVerse: 18, endVerse: 23 },
      ]},
      // §107
      { label: "Jesus' Witness concerning John", passages: [
        { book: "Matthew", chapter: 11, startVerse: 7, endVerse: 19 },
        { book: "Luke", chapter: 7, startVerse: 24, endVerse: 35 },
      ]},
      // §114
      { label: "The Anointing at Bethany", passages: [
        { book: "Matthew", chapter: 26, startVerse: 6, endVerse: 13 },
        { book: "Mark", chapter: 14, startVerse: 3, endVerse: 9 },
        { book: "Luke", chapter: 7, startVerse: 36, endVerse: 50 },
        { book: "John", chapter: 12, startVerse: 1, endVerse: 8 },
      ]},

      // ── Beelzebub and Signs ──────────────────────────────────────
      // §117
      { label: "The Beelzebub Controversy", passages: [
        { book: "Matthew", chapter: 12, startVerse: 22, endVerse: 30 },
        { book: "Mark", chapter: 3, startVerse: 22, endVerse: 27 },
        { book: "Luke", chapter: 11, startVerse: 14, endVerse: 23 },
      ]},
      // §118
      { label: "Sin against the Holy Spirit", passages: [
        { book: "Matthew", chapter: 12, startVerse: 31, endVerse: 37 },
        { book: "Mark", chapter: 3, startVerse: 28, endVerse: 30 },
      ]},
      // §119
      { label: "The Sign of Jonah", passages: [
        { book: "Matthew", chapter: 12, startVerse: 38, endVerse: 42 },
        { book: "Mark", chapter: 8, startVerse: 11, endVerse: 12 },
        { book: "Luke", chapter: 11, startVerse: 29, endVerse: 32 },
      ]},
      // §121
      { label: "Jesus' True Kindred", passages: [
        { book: "Matthew", chapter: 12, startVerse: 46, endVerse: 50 },
        { book: "Mark", chapter: 3, startVerse: 31, endVerse: 35 },
        { book: "Luke", chapter: 8, startVerse: 19, endVerse: 21 },
      ]},

      // ── Parables ─────────────────────────────────────────────────
      // §122
      { label: "Parable of the Sower", passages: [
        { book: "Matthew", chapter: 13, startVerse: 1, endVerse: 9 },
        { book: "Mark", chapter: 4, startVerse: 1, endVerse: 9 },
        { book: "Luke", chapter: 8, startVerse: 4, endVerse: 8 },
      ]},
      // §124
      { label: "Interpretation of the Sower", passages: [
        { book: "Matthew", chapter: 13, startVerse: 18, endVerse: 23 },
        { book: "Mark", chapter: 4, startVerse: 13, endVerse: 20 },
        { book: "Luke", chapter: 8, startVerse: 11, endVerse: 15 },
      ]},
      // §128
      { label: "Parable of the Mustard Seed", passages: [
        { book: "Matthew", chapter: 13, startVerse: 31, endVerse: 32 },
        { book: "Mark", chapter: 4, startVerse: 30, endVerse: 32 },
        { book: "Luke", chapter: 13, startVerse: 18, endVerse: 19 },
      ]},
      // §129
      { label: "Parable of the Leaven", passages: [
        { book: "Matthew", chapter: 13, startVerse: 33, endVerse: 33 },
        { book: "Luke", chapter: 13, startVerse: 20, endVerse: 21 },
      ]},
      // §130
      { label: "Jesus' Use of Parables", passages: [
        { book: "Matthew", chapter: 13, startVerse: 34, endVerse: 35 },
        { book: "Mark", chapter: 4, startVerse: 33, endVerse: 34 },
      ]},
      // §169
      { label: "Parable of the Lost Sheep", passages: [
        { book: "Matthew", chapter: 18, startVerse: 10, endVerse: 14 },
        { book: "Luke", chapter: 15, startVerse: 1, endVerse: 7 },
      ]},
      // §216
      { label: "Parable of the Great Supper", passages: [
        { book: "Matthew", chapter: 22, startVerse: 1, endVerse: 14 },
        { book: "Luke", chapter: 14, startVerse: 15, endVerse: 24 },
      ]},
      // §266
      { label: "Parable of the Talents / Pounds", passages: [
        { book: "Matthew", chapter: 25, startVerse: 14, endVerse: 30 },
        { book: "Luke", chapter: 19, startVerse: 11, endVerse: 27 },
      ]},
      // §278
      { label: "Parable of the Wicked Tenants", passages: [
        { book: "Matthew", chapter: 21, startVerse: 33, endVerse: 46 },
        { book: "Mark", chapter: 12, startVerse: 1, endVerse: 12 },
        { book: "Luke", chapter: 20, startVerse: 9, endVerse: 19 },
      ]},

      // ── Sending and Mission ──────────────────────────────────────
      // §142
      { label: "Commissioning the Twelve", passages: [
        { book: "Matthew", chapter: 10, startVerse: 1, endVerse: 14 },
        { book: "Mark", chapter: 6, startVerse: 6, endVerse: 13 },
        { book: "Luke", chapter: 9, startVerse: 1, endVerse: 6 },
      ]},
      // §143
      { label: "Opinions regarding Jesus", passages: [
        { book: "Matthew", chapter: 14, startVerse: 1, endVerse: 2 },
        { book: "Mark", chapter: 6, startVerse: 14, endVerse: 16 },
        { book: "Luke", chapter: 9, startVerse: 7, endVerse: 9 },
      ]},
      // §144
      { label: "Death of John the Baptist", passages: [
        { book: "Matthew", chapter: 14, startVerse: 3, endVerse: 12 },
        { book: "Mark", chapter: 6, startVerse: 17, endVerse: 29 },
        { book: "Luke", chapter: 3, startVerse: 19, endVerse: 20 },
      ]},

      // ── Feeding and Sea Miracles ─────────────────────────────────
      // §146
      { label: "Feeding of the Five Thousand", passages: [
        { book: "Matthew", chapter: 14, startVerse: 13, endVerse: 21 },
        { book: "Mark", chapter: 6, startVerse: 32, endVerse: 44 },
        { book: "Luke", chapter: 9, startVerse: 10, endVerse: 17 },
        { book: "John", chapter: 6, startVerse: 1, endVerse: 15 },
      ]},
      // §147
      { label: "Walking on Water", passages: [
        { book: "Matthew", chapter: 14, startVerse: 22, endVerse: 33 },
        { book: "Mark", chapter: 6, startVerse: 45, endVerse: 52 },
        { book: "John", chapter: 6, startVerse: 16, endVerse: 21 },
      ]},
      // §150
      { label: "Defilement — Traditional and Real", passages: [
        { book: "Matthew", chapter: 15, startVerse: 1, endVerse: 20 },
        { book: "Mark", chapter: 7, startVerse: 1, endVerse: 23 },
      ]},
      // §151
      { label: "The Syrophoenician Woman", passages: [
        { book: "Matthew", chapter: 15, startVerse: 21, endVerse: 28 },
        { book: "Mark", chapter: 7, startVerse: 24, endVerse: 30 },
      ]},
      // §153
      { label: "Feeding of the Four Thousand", passages: [
        { book: "Matthew", chapter: 15, startVerse: 32, endVerse: 39 },
        { book: "Mark", chapter: 8, startVerse: 1, endVerse: 10 },
      ]},

      // ── Peter's Confession and Transfiguration ───────────────────
      // §158
      { label: "Peter's Confession", passages: [
        { book: "Matthew", chapter: 16, startVerse: 13, endVerse: 20 },
        { book: "Mark", chapter: 8, startVerse: 27, endVerse: 30 },
        { book: "Luke", chapter: 9, startVerse: 18, endVerse: 21 },
        { book: "John", chapter: 6, startVerse: 67, endVerse: 71 },
      ]},
      // §159
      { label: "First Prediction of the Passion", passages: [
        { book: "Matthew", chapter: 16, startVerse: 21, endVerse: 23 },
        { book: "Mark", chapter: 8, startVerse: 31, endVerse: 33 },
        { book: "Luke", chapter: 9, startVerse: 22, endVerse: 22 },
      ]},
      // §160
      { label: "If Any Man Would Come after Me", passages: [
        { book: "Matthew", chapter: 16, startVerse: 24, endVerse: 28 },
        { book: "Mark", chapter: 8, startVerse: 34, endVerse: 38 },
        { book: "Luke", chapter: 9, startVerse: 23, endVerse: 27 },
      ]},
      // §161
      { label: "The Transfiguration", passages: [
        { book: "Matthew", chapter: 17, startVerse: 1, endVerse: 9 },
        { book: "Mark", chapter: 9, startVerse: 2, endVerse: 10 },
        { book: "Luke", chapter: 9, startVerse: 28, endVerse: 36 },
      ]},
      // §162
      { label: "The Coming of Elijah", passages: [
        { book: "Matthew", chapter: 17, startVerse: 10, endVerse: 13 },
        { book: "Mark", chapter: 9, startVerse: 11, endVerse: 13 },
      ]},
      // §163
      { label: "Healing of a Boy with an Unclean Spirit", passages: [
        { book: "Matthew", chapter: 17, startVerse: 14, endVerse: 21 },
        { book: "Mark", chapter: 9, startVerse: 14, endVerse: 29 },
        { book: "Luke", chapter: 9, startVerse: 37, endVerse: 43 },
      ]},
      // §164
      { label: "Second Prediction of the Passion", passages: [
        { book: "Matthew", chapter: 17, startVerse: 22, endVerse: 23 },
        { book: "Mark", chapter: 9, startVerse: 30, endVerse: 32 },
        { book: "Luke", chapter: 9, startVerse: 43, endVerse: 45 },
      ]},
      // §166
      { label: "True Greatness", passages: [
        { book: "Matthew", chapter: 18, startVerse: 1, endVerse: 5 },
        { book: "Mark", chapter: 9, startVerse: 33, endVerse: 37 },
        { book: "Luke", chapter: 9, startVerse: 46, endVerse: 48 },
      ]},

      // ── Journey to Jerusalem ─────────────────────────────────────
      // §182
      { label: "The Greatest Commandment", passages: [
        { book: "Matthew", chapter: 22, startVerse: 34, endVerse: 40 },
        { book: "Mark", chapter: 12, startVerse: 28, endVerse: 34 },
        { book: "Luke", chapter: 10, startVerse: 25, endVerse: 28 },
      ]},
      // §252
      { label: "On Divorce", passages: [
        { book: "Matthew", chapter: 19, startVerse: 3, endVerse: 12 },
        { book: "Mark", chapter: 10, startVerse: 2, endVerse: 12 },
      ]},
      // §253
      { label: "Jesus Blesses the Children", passages: [
        { book: "Matthew", chapter: 19, startVerse: 13, endVerse: 15 },
        { book: "Mark", chapter: 10, startVerse: 13, endVerse: 16 },
        { book: "Luke", chapter: 18, startVerse: 15, endVerse: 17 },
      ]},
      // §254
      { label: "The Rich Young Man", passages: [
        { book: "Matthew", chapter: 19, startVerse: 16, endVerse: 22 },
        { book: "Mark", chapter: 10, startVerse: 17, endVerse: 22 },
        { book: "Luke", chapter: 18, startVerse: 18, endVerse: 23 },
      ]},
      // §255
      { label: "On Riches and the Rewards of Discipleship", passages: [
        { book: "Matthew", chapter: 19, startVerse: 23, endVerse: 30 },
        { book: "Mark", chapter: 10, startVerse: 23, endVerse: 31 },
        { book: "Luke", chapter: 18, startVerse: 24, endVerse: 30 },
      ]},
      // §262
      { label: "Third Prediction of the Passion", passages: [
        { book: "Matthew", chapter: 20, startVerse: 17, endVerse: 19 },
        { book: "Mark", chapter: 10, startVerse: 32, endVerse: 34 },
        { book: "Luke", chapter: 18, startVerse: 31, endVerse: 34 },
      ]},
      // §263
      { label: "The Sons of Zebedee: Precedence among Disciples", passages: [
        { book: "Matthew", chapter: 20, startVerse: 20, endVerse: 28 },
        { book: "Mark", chapter: 10, startVerse: 35, endVerse: 45 },
      ]},
      // §264
      { label: "Healing of the Blind", passages: [
        { book: "Matthew", chapter: 20, startVerse: 29, endVerse: 34 },
        { book: "Mark", chapter: 10, startVerse: 46, endVerse: 52 },
        { book: "Luke", chapter: 18, startVerse: 35, endVerse: 43 },
      ]},

      // ── Final Ministry in Jerusalem ──────────────────────────────
      // §269
      { label: "The Triumphal Entry", passages: [
        { book: "Matthew", chapter: 21, startVerse: 1, endVerse: 9 },
        { book: "Mark", chapter: 11, startVerse: 1, endVerse: 10 },
        { book: "Luke", chapter: 19, startVerse: 28, endVerse: 40 },
        { book: "John", chapter: 12, startVerse: 12, endVerse: 19 },
      ]},
      // §272
      { label: "The Cursing of the Fig Tree", passages: [
        { book: "Matthew", chapter: 21, startVerse: 18, endVerse: 19 },
        { book: "Mark", chapter: 11, startVerse: 12, endVerse: 14 },
      ]},
      // §273
      { label: "The Cleansing of the Temple", passages: [
        { book: "Matthew", chapter: 21, startVerse: 12, endVerse: 13 },
        { book: "Mark", chapter: 11, startVerse: 15, endVerse: 17 },
        { book: "Luke", chapter: 19, startVerse: 45, endVerse: 46 },
        { book: "John", chapter: 2, startVerse: 13, endVerse: 17 },
      ]},
      // §276
      { label: "The Question about Authority", passages: [
        { book: "Matthew", chapter: 21, startVerse: 23, endVerse: 27 },
        { book: "Mark", chapter: 11, startVerse: 27, endVerse: 33 },
        { book: "Luke", chapter: 20, startVerse: 1, endVerse: 8 },
      ]},
      // §280
      { label: "Paying Tribute to Caesar", passages: [
        { book: "Matthew", chapter: 22, startVerse: 15, endVerse: 22 },
        { book: "Mark", chapter: 12, startVerse: 13, endVerse: 17 },
        { book: "Luke", chapter: 20, startVerse: 20, endVerse: 26 },
      ]},
      // §281
      { label: "The Question about the Resurrection", passages: [
        { book: "Matthew", chapter: 22, startVerse: 23, endVerse: 33 },
        { book: "Mark", chapter: 12, startVerse: 18, endVerse: 27 },
        { book: "Luke", chapter: 20, startVerse: 27, endVerse: 40 },
      ]},
      // §283
      { label: "The Question about David's Son", passages: [
        { book: "Matthew", chapter: 22, startVerse: 41, endVerse: 46 },
        { book: "Mark", chapter: 12, startVerse: 35, endVerse: 37 },
        { book: "Luke", chapter: 20, startVerse: 41, endVerse: 44 },
      ]},
      // §284
      { label: "Woe to the Scribes and Pharisees", passages: [
        { book: "Matthew", chapter: 23, startVerse: 1, endVerse: 36 },
        { book: "Mark", chapter: 12, startVerse: 37, endVerse: 40 },
        { book: "Luke", chapter: 20, startVerse: 45, endVerse: 47 },
      ]},
      // §286
      { label: "The Widow's Offering", passages: [
        { book: "Mark", chapter: 12, startVerse: 41, endVerse: 44 },
        { book: "Luke", chapter: 21, startVerse: 1, endVerse: 4 },
      ]},

      // ── Olivet Discourse ─────────────────────────────────────────
      // §287
      { label: "Prediction of the Destruction of the Temple", passages: [
        { book: "Matthew", chapter: 24, startVerse: 1, endVerse: 2 },
        { book: "Mark", chapter: 13, startVerse: 1, endVerse: 2 },
        { book: "Luke", chapter: 21, startVerse: 5, endVerse: 6 },
      ]},
      // §288
      { label: "Signs before the End", passages: [
        { book: "Matthew", chapter: 24, startVerse: 3, endVerse: 8 },
        { book: "Mark", chapter: 13, startVerse: 3, endVerse: 8 },
        { book: "Luke", chapter: 21, startVerse: 7, endVerse: 11 },
      ]},
      // §289
      { label: "Persecutions Foretold", passages: [
        { book: "Matthew", chapter: 24, startVerse: 9, endVerse: 14 },
        { book: "Mark", chapter: 13, startVerse: 9, endVerse: 13 },
        { book: "Luke", chapter: 21, startVerse: 12, endVerse: 19 },
      ]},
      // §290
      { label: "The Desolating Sacrilege", passages: [
        { book: "Matthew", chapter: 24, startVerse: 15, endVerse: 22 },
        { book: "Mark", chapter: 13, startVerse: 14, endVerse: 20 },
        { book: "Luke", chapter: 21, startVerse: 20, endVerse: 24 },
      ]},
      // §291
      { label: "False Christs and False Prophets", passages: [
        { book: "Matthew", chapter: 24, startVerse: 23, endVerse: 28 },
        { book: "Mark", chapter: 13, startVerse: 21, endVerse: 23 },
      ]},
      // §292
      { label: "The Coming of the Son of Man", passages: [
        { book: "Matthew", chapter: 24, startVerse: 29, endVerse: 31 },
        { book: "Mark", chapter: 13, startVerse: 24, endVerse: 27 },
        { book: "Luke", chapter: 21, startVerse: 25, endVerse: 28 },
      ]},
      // §293
      { label: "Parable of the Fig Tree: the Time of the Coming", passages: [
        { book: "Matthew", chapter: 24, startVerse: 32, endVerse: 36 },
        { book: "Mark", chapter: 13, startVerse: 28, endVerse: 32 },
        { book: "Luke", chapter: 21, startVerse: 29, endVerse: 33 },
      ]},

      // ── Passion Narrative ────────────────────────────────────────
      // §305
      { label: "The Plot to Kill Jesus", passages: [
        { book: "Matthew", chapter: 26, startVerse: 1, endVerse: 5 },
        { book: "Mark", chapter: 14, startVerse: 1, endVerse: 2 },
        { book: "Luke", chapter: 22, startVerse: 1, endVerse: 2 },
      ]},
      // §307
      { label: "The Betrayal by Judas", passages: [
        { book: "Matthew", chapter: 26, startVerse: 14, endVerse: 16 },
        { book: "Mark", chapter: 14, startVerse: 10, endVerse: 11 },
        { book: "Luke", chapter: 22, startVerse: 3, endVerse: 6 },
      ]},
      // §308
      { label: "Preparation for the Passover", passages: [
        { book: "Matthew", chapter: 26, startVerse: 17, endVerse: 20 },
        { book: "Mark", chapter: 14, startVerse: 12, endVerse: 17 },
        { book: "Luke", chapter: 22, startVerse: 7, endVerse: 14 },
      ]},
      // §310
      { label: "Jesus Foretells His Betrayal", passages: [
        { book: "Matthew", chapter: 26, startVerse: 21, endVerse: 25 },
        { book: "Mark", chapter: 14, startVerse: 18, endVerse: 21 },
        { book: "Luke", chapter: 22, startVerse: 21, endVerse: 23 },
        { book: "John", chapter: 13, startVerse: 21, endVerse: 30 },
      ]},
      // §311
      { label: "The Last Supper", passages: [
        { book: "Matthew", chapter: 26, startVerse: 26, endVerse: 29 },
        { book: "Mark", chapter: 14, startVerse: 22, endVerse: 25 },
        { book: "Luke", chapter: 22, startVerse: 15, endVerse: 20 },
      ]},
      // §315
      { label: "Peter's Denial Predicted", passages: [
        { book: "Matthew", chapter: 26, startVerse: 30, endVerse: 35 },
        { book: "Mark", chapter: 14, startVerse: 26, endVerse: 31 },
        { book: "Luke", chapter: 22, startVerse: 31, endVerse: 34 },
        { book: "John", chapter: 13, startVerse: 36, endVerse: 38 },
      ]},
      // §330
      { label: "Gethsemane", passages: [
        { book: "Matthew", chapter: 26, startVerse: 36, endVerse: 46 },
        { book: "Mark", chapter: 14, startVerse: 32, endVerse: 42 },
        { book: "Luke", chapter: 22, startVerse: 39, endVerse: 46 },
      ]},
      // §331
      { label: "The Arrest of Jesus", passages: [
        { book: "Matthew", chapter: 26, startVerse: 47, endVerse: 56 },
        { book: "Mark", chapter: 14, startVerse: 43, endVerse: 52 },
        { book: "Luke", chapter: 22, startVerse: 47, endVerse: 53 },
        { book: "John", chapter: 18, startVerse: 2, endVerse: 12 },
      ]},
      // §332
      { label: "Jesus before the Sanhedrin", passages: [
        { book: "Matthew", chapter: 26, startVerse: 57, endVerse: 68 },
        { book: "Mark", chapter: 14, startVerse: 53, endVerse: 65 },
        { book: "Luke", chapter: 22, startVerse: 54, endVerse: 71 },
        { book: "John", chapter: 18, startVerse: 13, endVerse: 24 },
      ]},
      // §333
      { label: "Peter's Denial", passages: [
        { book: "Matthew", chapter: 26, startVerse: 69, endVerse: 75 },
        { book: "Mark", chapter: 14, startVerse: 66, endVerse: 72 },
        { book: "Luke", chapter: 22, startVerse: 56, endVerse: 62 },
        { book: "John", chapter: 18, startVerse: 25, endVerse: 27 },
      ]},
      // §336
      { label: "The Trial before Pilate", passages: [
        { book: "Matthew", chapter: 27, startVerse: 11, endVerse: 14 },
        { book: "Mark", chapter: 15, startVerse: 2, endVerse: 5 },
        { book: "Luke", chapter: 23, startVerse: 2, endVerse: 5 },
        { book: "John", chapter: 18, startVerse: 29, endVerse: 38 },
      ]},
      // §339
      { label: "Jesus or Barabbas", passages: [
        { book: "Matthew", chapter: 27, startVerse: 15, endVerse: 23 },
        { book: "Mark", chapter: 15, startVerse: 6, endVerse: 14 },
        { book: "Luke", chapter: 23, startVerse: 17, endVerse: 23 },
        { book: "John", chapter: 18, startVerse: 39, endVerse: 40 },
      ]},
      // §341
      { label: "Pilate Delivers Jesus to be Crucified", passages: [
        { book: "Matthew", chapter: 27, startVerse: 24, endVerse: 26 },
        { book: "Mark", chapter: 15, startVerse: 15, endVerse: 15 },
        { book: "Luke", chapter: 23, startVerse: 24, endVerse: 25 },
        { book: "John", chapter: 19, startVerse: 16, endVerse: 16 },
      ]},
      // §342
      { label: "Jesus Mocked by the Soldiers", passages: [
        { book: "Matthew", chapter: 27, startVerse: 27, endVerse: 31 },
        { book: "Mark", chapter: 15, startVerse: 16, endVerse: 20 },
        { book: "John", chapter: 19, startVerse: 2, endVerse: 3 },
      ]},
      // §343
      { label: "The Road to Golgotha", passages: [
        { book: "Matthew", chapter: 27, startVerse: 31, endVerse: 32 },
        { book: "Mark", chapter: 15, startVerse: 20, endVerse: 21 },
        { book: "Luke", chapter: 23, startVerse: 26, endVerse: 32 },
        { book: "John", chapter: 19, startVerse: 17, endVerse: 17 },
      ]},
      // §344
      { label: "The Crucifixion", passages: [
        { book: "Matthew", chapter: 27, startVerse: 33, endVerse: 37 },
        { book: "Mark", chapter: 15, startVerse: 22, endVerse: 26 },
        { book: "Luke", chapter: 23, startVerse: 33, endVerse: 34 },
        { book: "John", chapter: 19, startVerse: 17, endVerse: 27 },
      ]},
      // §345
      { label: "Jesus Derided on the Cross", passages: [
        { book: "Matthew", chapter: 27, startVerse: 38, endVerse: 43 },
        { book: "Mark", chapter: 15, startVerse: 27, endVerse: 32 },
        { book: "Luke", chapter: 23, startVerse: 35, endVerse: 38 },
      ]},
      // §346
      { label: "The Two Thieves", passages: [
        { book: "Matthew", chapter: 27, startVerse: 44, endVerse: 44 },
        { book: "Mark", chapter: 15, startVerse: 32, endVerse: 32 },
        { book: "Luke", chapter: 23, startVerse: 39, endVerse: 43 },
      ]},
      // §347
      { label: "The Death of Jesus", passages: [
        { book: "Matthew", chapter: 27, startVerse: 45, endVerse: 54 },
        { book: "Mark", chapter: 15, startVerse: 33, endVerse: 39 },
        { book: "Luke", chapter: 23, startVerse: 44, endVerse: 48 },
        { book: "John", chapter: 19, startVerse: 28, endVerse: 30 },
      ]},
      // §348
      { label: "Witnesses of the Crucifixion", passages: [
        { book: "Matthew", chapter: 27, startVerse: 55, endVerse: 56 },
        { book: "Mark", chapter: 15, startVerse: 40, endVerse: 41 },
        { book: "Luke", chapter: 23, startVerse: 49, endVerse: 49 },
        { book: "John", chapter: 19, startVerse: 25, endVerse: 27 },
      ]},
      // §350
      { label: "The Burial of Jesus", passages: [
        { book: "Matthew", chapter: 27, startVerse: 57, endVerse: 61 },
        { book: "Mark", chapter: 15, startVerse: 42, endVerse: 47 },
        { book: "Luke", chapter: 23, startVerse: 50, endVerse: 56 },
        { book: "John", chapter: 19, startVerse: 38, endVerse: 42 },
      ]},

      // ── Resurrection ─────────────────────────────────────────────
      // §352
      { label: "The Women at the Empty Tomb", passages: [
        { book: "Matthew", chapter: 28, startVerse: 1, endVerse: 8 },
        { book: "Mark", chapter: 16, startVerse: 1, endVerse: 8 },
        { book: "Luke", chapter: 24, startVerse: 1, endVerse: 12 },
        { book: "John", chapter: 20, startVerse: 1, endVerse: 13 },
      ]},
      // §353
      { label: "Jesus Appears to the Women", passages: [
        { book: "Matthew", chapter: 28, startVerse: 9, endVerse: 10 },
        { book: "Mark", chapter: 16, startVerse: 9, endVerse: 11 },
        { book: "John", chapter: 20, startVerse: 14, endVerse: 18 },
      ]},
      // §364/365
      { label: "The Great Commission", passages: [
        { book: "Matthew", chapter: 28, startVerse: 16, endVerse: 20 },
        { book: "Luke", chapter: 24, startVerse: 44, endVerse: 53 },
      ]},

      // ── Notable Single-Gospel Passages (for study context) ───────

      // Unique to Luke
      { label: "Parable of the Good Samaritan", passages: [
        { book: "Luke", chapter: 10, startVerse: 25, endVerse: 37 },
      ]},
      { label: "Mary and Martha", passages: [
        { book: "Luke", chapter: 10, startVerse: 38, endVerse: 42 },
      ]},
      { label: "Parable of the Prodigal Son", passages: [
        { book: "Luke", chapter: 15, startVerse: 11, endVerse: 32 },
      ]},
      { label: "Parable of the Rich Man and Lazarus", passages: [
        { book: "Luke", chapter: 16, startVerse: 19, endVerse: 31 },
      ]},
      { label: "Healing of the Ten Lepers", passages: [
        { book: "Luke", chapter: 17, startVerse: 11, endVerse: 19 },
      ]},
      { label: "The Pharisee and the Tax Collector", passages: [
        { book: "Luke", chapter: 18, startVerse: 9, endVerse: 14 },
      ]},
      { label: "Zacchaeus", passages: [
        { book: "Luke", chapter: 19, startVerse: 1, endVerse: 10 },
      ]},
      { label: "The Road to Emmaus", passages: [
        { book: "Luke", chapter: 24, startVerse: 13, endVerse: 35 },
      ]},

      // Unique to John
      { label: "The Wedding at Cana", passages: [
        { book: "John", chapter: 2, startVerse: 1, endVerse: 11 },
      ]},
      { label: "Discourse with Nicodemus", passages: [
        { book: "John", chapter: 3, startVerse: 1, endVerse: 21 },
      ]},
      { label: "The Woman at the Well", passages: [
        { book: "John", chapter: 4, startVerse: 4, endVerse: 42 },
      ]},
      { label: "Healing at the Pool of Bethesda", passages: [
        { book: "John", chapter: 5, startVerse: 2, endVerse: 47 },
      ]},
      { label: "The Bread of Life Discourse", passages: [
        { book: "John", chapter: 6, startVerse: 26, endVerse: 59 },
      ]},
      { label: "The Light of the World", passages: [
        { book: "John", chapter: 8, startVerse: 12, endVerse: 20 },
      ]},
      { label: "Healing of the Man Born Blind", passages: [
        { book: "John", chapter: 9, startVerse: 1, endVerse: 41 },
      ]},
      { label: "The Good Shepherd", passages: [
        { book: "John", chapter: 10, startVerse: 1, endVerse: 18 },
      ]},
      { label: "The Raising of Lazarus", passages: [
        { book: "John", chapter: 11, startVerse: 1, endVerse: 44 },
      ]},
      { label: "Washing the Disciples' Feet", passages: [
        { book: "John", chapter: 13, startVerse: 1, endVerse: 20 },
      ]},
      { label: "The Farewell Discourse", passages: [
        { book: "John", chapter: 14, startVerse: 1, endVerse: 31 },
        { book: "John", chapter: 15, startVerse: 1, endVerse: 27 },
        { book: "John", chapter: 16, startVerse: 1, endVerse: 33 },
      ]},
      { label: "The High Priestly Prayer", passages: [
        { book: "John", chapter: 17, startVerse: 1, endVerse: 26 },
      ]},
      { label: "Appearance to Thomas", passages: [
        { book: "John", chapter: 20, startVerse: 24, endVerse: 29 },
      ]},
      { label: "Restoration of Peter", passages: [
        { book: "John", chapter: 21, startVerse: 15, endVerse: 19 },
      ]},
    ]

    for (const p of parallels) {
      await ctx.db.insert("gospelParallels", p)
    }
  },
})
