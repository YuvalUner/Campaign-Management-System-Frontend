"""
A script used to convert C# models to TypeScript models.
In order to use it, copy the C# model to the text variable, and run the script.
Included here so that it can be used in the future, and also so that it will be somewhat documented.
"""

def c_sharp_to_ts(text):
    # Convert C# docstring to TypeScript docstring
    # ...
    text = text.replace("/// <summary>", "/**")
    text = text.replace("/// </summary>", "*/")
    text = text.replace("/// ", "* ")
    return text


def to_kebab_case(text):
    new_text = ""
    for i, char in enumerate(text):
        if char.isupper() and i != 0:
            new_text += f"-{char.lower()}"
        elif char.isupper():
            new_text += char.lower()
        else:
            new_text += char
    return new_text


def c_sharp_model_to_ts_model(text):
    text = c_sharp_to_ts(text)
    final_text = ""
    text_lines = text.splitlines()
    file_name = ""
    interface_name = ""
    start_swapping = False
    for i, line in enumerate(text_lines):
        if line.startswith("using"):
            continue
        if line.startswith("namespace"):
            continue
        if line == "":
            continue
        if line.startswith("public"):
            interface_name = line.split(" ")[2]
            file_name = to_kebab_case(interface_name)
            final_text += "interface " + interface_name
            if line.__contains__(":"):
                extended_class = line.split(":")[1].strip()
                final_text += f" extends {extended_class}\n"
            else:
                final_text += "\n"
        elif line.startswith("{"):
            start_swapping = True
            final_text += "{\n"
        elif line.startswith("}"):
            start_swapping = False
            final_text += "}\n"
            break
        elif start_swapping:
            line = line.strip()
            line = line.replace("public", "")
            line = line.replace("{ get; set; }", "")
            prop_name = line.split(" ")[2]
            line_beginning = prop_name[0].lower()
            prop_name = line_beginning + prop_name[1:]
            prop_type = line.split(" ")[1]
            if prop_type == "string?":
                prop_type = "string | null"
            elif prop_type == "int?":
                prop_type = "number | null"
            elif prop_type == "bool?":
                prop_type = "boolean | null"
            elif prop_type == "Decimal?":
                prop_type = "number | null"
            elif prop_type == "Guid?":
                prop_type = "string | null"
            elif prop_type == "DateTime?":
                prop_type = "Date | null"
            elif prop_type == "int":
                prop_type = "number"
            elif prop_type == "double?":
                prop_type = "number | null"
            final_text += f"    {prop_name}: {prop_type};\n"
        else:
            final_text += line + "\n"
    final_text += f"export default {interface_name};\n"
    return final_text, file_name


if __name__ == '__main__':
    text = """
namespace DAL.Models;

using DbAccess;

/// <summary>
/// A model for the result of the <see cref="StoredProcedureNames.FilterVotersLedger"/> stored procedure, and an extension
/// of <see cref="VotersLedgerRecord"/>.<br/>
/// Each instance of this class represents a single record from the voters ledger table, with the addition of the user's
/// phone number(s), email address(es), support status for a campaign, and the ballot assigned to them.
/// </summary>
public class VotersLedgerFilterRecord : VotersLedgerRecord
{
    public string? Email1 { get; set; }
    public string? Email2 { get; set; }
    public string? Phone1 { get; set; }
    public string? Phone2 { get; set; }
    public double? InnerCityBallotId { get; set; }
    public string? BallotAddress { get; set; }
    public string? BallotLocation { get; set; }
    public bool? Accessible { get; set; }
    public int? ElligibleVoters { get; set; }
    public bool? SupportStatus { get; set; }
}

    """

    new_text, file_name = c_sharp_model_to_ts_model(text)
    with open(f"{file_name}.ts", 'w') as f:
        f.write(new_text)
