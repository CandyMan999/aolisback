import React from "react";
import get from "lodash/get";

import missingFields from "./missingFields";

class ProfileProgress extends React.PureComponent {
  calculateTotal = (counts) => {
    return Object.values(counts).reduce((total, val) => total + val, 0);
  };

  calculateCompletedCounts = () => {
    const me = this.props.me;

    const completedCounts = Object.keys(missingFields).reduce(
      (counts, field) => {
        const { required, hasLength, oneOf, oneOfLength, matches } =
          missingFields[field];

        let count = 0;

        //matches
        if (!!matches && !!matches.length) {
          matches.forEach((requiredField) => {
            if (
              get(me, requiredField)[0] !== 0 &&
              get(me, requiredField)[1] !== 0
            ) {
              count++;
            }
          });
        }
        // required
        if (!!required && !!required.length) {
          required.forEach((requiredField) => {
            if (!!get(me, requiredField)) {
              count++;
            }
          });
        }

        // hasLength
        if (!!hasLength && !!hasLength.length) {
          hasLength.forEach((hasLengthField) => {
            if (!!get(me, hasLengthField).length) {
              count++;
            }
          });
        }

        // oneOf
        if (!!oneOf && !!oneOf.length) {
          me.pictures.forEach((field) => {
            if (
              field.type === "MASSAGE_LICENSE" ||
              field.type === "DRIVERS_LICENSE"
            )
              count++;
          });
        }

        // oneOfLength
        if (!!oneOfLength && !!oneOfLength.length) {
          if (
            oneOfLength.some(
              (oneOfLengthField) => !!get(me, oneOfLengthField).length
            )
          ) {
            count++;
          }
        }

        counts[field] = count;
        return counts;
      },
      {}
    );

    completedCounts.total = this.calculateTotal(completedCounts);

    return completedCounts;
  };

  calculateTotalCounts = () => {
    const totalCounts = Object.keys(missingFields).reduce((counts, field) => {
      const { required, hasLength, oneOf, oneOfLength, matches } =
        missingFields[field];
      counts[field] =
        matches.length +
        required.length +
        hasLength.length +
        oneOf.length +
        Number(!!oneOfLength.length);
      return counts;
    }, {});

    totalCounts.total = this.calculateTotal(totalCounts); // Add the 'total' key with the total count
    return totalCounts;
  };

  render() {
    const completedCounts = this.calculateCompletedCounts();
    const totalCounts = this.calculateTotalCounts();

    return this.props.children({
      completedCounts,
      totalCounts,
    });
  }
}

export default ProfileProgress;
