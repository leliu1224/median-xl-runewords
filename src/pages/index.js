import React, { useReact, useState } from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { toppings } from "../utils/toppings"
import Image from "../components/image"
import Img from "gatsby-image"

// import React, { Component } from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const IndexPage = props => {
  const { data } = props

  const runewords = data.allRunewordsJson.edges
  const runes = data.allRunesJson.edges
  const runeImages = data.allRunesJson.edges
  // console.log(image)
  // Create an array that contains all of the rune names along with the checked state
  const runesCheckedArray = runes.map(function (node) {
    return [node.node.name, false]
  })

  let [searchValue, setSearchValue] = useState("")
  let [runeChecked, setRuneChecked] = useState(runesCheckedArray)
  let [searchArray, setSearchArray] = useState([])
  let [searchRunewords, setSearchRunewords] = useState(runewords)

  // X Find the index values of the checkState array that has the value of 1
  // Grab the value of those index in the Runes array and push them into a separate array to be searched

  const handleCheckbox = (position, rune) => {
    // Update the state to the proper value
    // let updatedCheckedState = checkedState
    // updatedCheckedState[index] = !updatedCheckedState[index]
    let updatedRuneChecked = runeChecked.map((runeItem, index) =>
      index === position
        ? [runeItem[0], !runeItem[1]]
        : [runeItem[0], runeItem[1]]
    )
    setRuneChecked(updatedRuneChecked)
    // Remove the item if the state is false
    // Check if the index

    let updatedSearchArray = searchArray
    if (!runeChecked[position][1]) {
      // Push the rune to the array
      updatedSearchArray.push(rune)
      updatedSearchArray = updatedSearchArray.filter(function (item, pos) {
        return updatedSearchArray.indexOf(item) == pos
      })
      // console.log(updatedSearchArray)
      // Clean up the array to unique values
      // Set the search array state
      setSearchArray(updatedSearchArray)
    } else {
      updatedSearchArray.indexOf(rune)
      updatedSearchArray.splice(updatedSearchArray.indexOf(rune), 1)
      // console.log(updatedSearchArray)
      setSearchArray(updatedSearchArray)
    }

    // console.log(runeChecked[0])
    let tempRunewords = runewords

    // if (updatedSearchArray.length > 0) {
    const filteredData = tempRunewords.filter(runeword => {
      const requiredRunewords = runeword.node.runes
      // console.log(requiredRunewords)
      return updatedSearchArray.some(v => requiredRunewords.indexOf(v) >= 0)
    })

    setSearchRunewords(filteredData)
    // } else {
    //   setSearchRunewords(runewords)
    // }
  }

  const handleInputChange = event => {
    setSearchValue(event.target.value)
    if (event.target.value == "") {
      setSearchRunewords(runewords)
    }
  }

  const handleSearch = event => {
    let query = searchValue
    let filteredRunewords =
      searchRunewords.length > 1 ? searchRunewords : runewords

    const filteredData = filteredRunewords.filter(runeword => {
      const { name, items, stats } = runeword.node
      // console.log(name)
      // console.log(items)
      // console.log(stats)
      return (
        (name && name.join("").toLowerCase().includes(query.toLowerCase())) ||
        (items && items.join("").toLowerCase().includes(query.toLowerCase())) ||
        (stats && stats.join("").toLowerCase().includes(query.toLowerCase()))
      )
    })
    setSearchRunewords(filteredData)
    setSearchValue(query)
    event.preventDefault()
    // let hasSearchResults = searchRunewords.length > 0 && searchValue !== ""
    // let filteredRunewords = hasSearchResults ? searchRunewords : runewords
  }

  return (
    <Layout>
      <Seo title="Home" />
      <div className="runes-wrapper">
        {/* filter by all the elements in the array */}
        {/* compare it to the second index of the rune element object */}

        {runes.map((rune, index) => {
          // if (index > 0) return
          return (
            <div key={index} className="rune-container">
              <input
                type="checkbox"
                id={`rune-checkbox-${index}`}
                name={rune.node.name}
                value={rune.node.name}
                checked={runeChecked[index][1]}
                onChange={() => handleCheckbox(index, rune.node.name)}
              />
              {/* <img src={`/images/runes/${rune.node.name}.png`} alt="" /> */}

              <label htmlFor={`rune-checkbox-${index}`}>
                <Image
                  src={`runes/${rune.node.name}.png`}
                  className="rune-image"
                  alt={rune.node.name}
                />
                {rune.node.name}
              </label>
            </div>
          )
        })}
      </div>
      <div className="form-wrapper">
        <form className="search-form" onSubmit={handleSearch}>
          <input
            className="search-field"
            type="search"
            placeholder="Search Runeword, Item, Stats"
            aria-label="Search Runeword, Item, Stats"
            onChange={handleInputChange}
            value={searchValue}
          />
          <button class="btn btn-search" type="submit" onChange={handleSearch}>
            Search
          </button>
        </form>
      </div>
      <div className="runewords-wrapper">
        {searchRunewords
          ? // Apply filter here to check the second index of runeword.node.name matches anything in the array
            searchRunewords.map((runeword, i) => {
              return (
                <div
                  key={`runeword-container-${i}`}
                  className="runeword-container"
                >
                  <h1 key={`name-${i}`}>{runeword.node.name[0]}</h1>{" "}
                  <div className="runeword-runes">
                    {runeword.node.runes.map((rune, i) => {
                      {
                        if (rune != "") {
                          return <p key={`rune-${i}`}>{rune}</p>
                        }
                      }
                    })}
                  </div>
                  <div className="runeword-items">
                    {runeword.node.items.map((item, i) => {
                      {
                        if (item != "") {
                          return <p key={`item-${i}`}>{item}</p>
                        }
                      }
                    })}
                  </div>
                  <div className="runeword-level">
                    <p>Required Level {runeword.node.level}</p>{" "}
                  </div>
                  <div className="runeword-stats">
                    {runeword.node.stats.map((stat, i) => {
                      {
                        if (stat != "") {
                          return <p key={`stat-${i}`}>{stat}</p>
                        }
                      }
                    })}
                  </div>
                </div>
              )
            })
          : "Loading"}
      </div>
    </Layout>
  )
}

export default IndexPage

export const query = graphql`
  query {
    allRunewordsJson {
      edges {
        node {
          name
          level
          items
          stats
          runes
        }
      }
    }
    allRunesJson {
      edges {
        node {
          name
        }
      }
    }
  }
`
